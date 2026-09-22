const encoder = new TextEncoder();
const COOKIE = 'journey_companion';
const MAX_TEXT = 1200;
const ASSET_PREFIX = 'companion/portrait-20260922-8d5e214';
export const INTERACTIONS = {head:'摸头',cheek:'戳脸',shoulder:'拍肩',hand:'碰手',release:'拉手后松开',tease:'连续戳戳',wink:'眨眼',nod:'点头',wave:'打招呼',stretch:'活动身体',tea:'递了一杯茶',gift:'送了一个小礼物'};
const commonHeaders = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export class ApiError extends Error { constructor(status,code){super(code);this.status=status;} }
export function json(data,status=200,headers={}) {return new Response(JSON.stringify(data),{status,headers:{...commonHeaders,'Content-Type':'application/json; charset=utf-8',...headers}});}
const hex = bytes => Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const sha = async data => hex(await crypto.subtle.digest('SHA-256',typeof data==='string'?encoder.encode(data):data));
async function hmac(key,text){const imported=await crypto.subtle.importKey('raw',typeof key==='string'?encoder.encode(key):key,{name:'HMAC',hash:'SHA-256'},false,['sign']);return crypto.subtle.sign('HMAC',imported,encoder.encode(text));}
function cookieValue(request){return request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);}
export async function createSession(password,now=Date.now()) {
  const payload=Math.floor(now/1000+8*3600)+'.'+crypto.randomUUID();
  return payload+'.'+hex(await hmac(password,payload));
}
export async function authenticated(request,env,now=Date.now()) {
  if(!env.AUTH_PASSWORD)return false;const token=cookieValue(request);
  if(!token||!/^\d{10}\.[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(token))return false;
  const [expiry,nonce,signature]=token.split('.');const seconds=Math.floor(now/1000);
  if(Number(expiry)<=seconds||Number(expiry)>seconds+8*3600+60)return false;
  const key=await crypto.subtle.importKey('raw',encoder.encode(env.AUTH_PASSWORD),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  return crypto.subtle.verify('HMAC',key,Uint8Array.from(signature.match(/../g),v=>parseInt(v,16)),encoder.encode(expiry+'.'+nonce));
}
function requireOrigin(request) {
  const origin=request.headers.get('Origin');
  if(origin!==new URL(request.url).origin||request.headers.get('Sec-Fetch-Site')==='cross-site'||request.headers.get('X-Live2d-Client')!=='journey')throw new ApiError(403,'invalid_origin');
}
async function readJson(request,limit=96000){
  if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json')throw new ApiError(415,'json_required');
  if(Number(request.headers.get('Content-Length'))>limit)throw new ApiError(413,'body_too_large');
  const reader=request.body?.getReader();if(!reader)throw new ApiError(400,'invalid_body');let size=0;const chunks=[];
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new ApiError(413,'body_too_large');}chunks.push(value);}}
  finally{reader.releaseLock();}
  const buffer=new Uint8Array(size);let at=0;for(const chunk of chunks){buffer.set(chunk,at);at+=chunk.length;}
  try{const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buffer));if(!data||Array.isArray(data)||typeof data!=='object')throw Error();return data;}catch{throw new ApiError(400,'invalid_json');}
}
async function modelConfig(env){
  const config=await env.MY_BUCKET?.get((env.COMPANION_ASSET_PREFIX||ASSET_PREFIX)+'/config.json');
  if(!config)throw new ApiError(503,'model_not_configured');return config.json();
}
export function chatMessages(body){
  if(typeof body.text!=='string'||!body.text.trim()||body.text.length>MAX_TEXT)throw new ApiError(400,'invalid_message');
  if(typeof body.requestId!=='string'||! /^[a-f0-9-]{36}$/.test(body.requestId))throw new ApiError(400,'invalid_request_id');
  const name=typeof body.name==='string'?body.name.replace(/[\r\n\x00-\x1f]/g,'').slice(0,20)||'小忆':'小忆';
  let prompt=`你是名叫${JSON.stringify(name)}的卡通AI伙伴，用自然、温和、轻松的中文聊天。外观是蓬松黑发、格纹衣领、浅色上衣和米黄色裤子。你不是参考照片中的真人，不编造真人的经历和身份，也不能看见摄像头。记住提供的上下文。通常回复一到三句，最多120个中文字。不要使用Markdown、括号动作或舞台说明，回答会被朗读。页面支持摸头、戳脸、拍肩、拉手跟随与松手恢复，以及递茶、送礼、眨眼、点头、身体摆动和视线跟随。没有弯肘持物、走路或操作外部服务的能力。`;
  const event=typeof body.interaction==='string'&&INTERACTIONS[body.interaction];
  if(event)prompt+=`用户最近在页面触发了“${event}”互动动画，与本轮话题相关时自然回应。`;
  const history=Array.isArray(body.history)?body.history.slice(-24).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,MAX_TEXT)})):[];
  return [{role:'system',content:prompt},...history,{role:'user',content:body.text.trim()}];
}
export async function chatResponse(body,env,fetcher=fetch){
  const messages=chatMessages(body);if(!env.COMPANION_LLM_API_KEY)throw new ApiError(503,'chat_not_configured');
  const base=env.COMPANION_API_BASE_URL||'https://api.apexin.ai/v1';
  if(!base.startsWith('https://'))throw new ApiError(503,'invalid_provider_config');
  const abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),60000);
  let upstream;
  try{upstream=await fetcher(base.replace(/\/$/,'')+'/chat/completions',{method:'POST',redirect:'error',signal:abort.signal,
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.COMPANION_LLM_API_KEY},
    body:JSON.stringify({model:env.COMPANION_CHAT_MODEL||'gpt-5.6-luna',messages,stream:true,max_completion_tokens:550,reasoning_effort:'low'})});}
  catch{clearTimeout(timeout);throw new ApiError(503,'chat_unavailable');}
  if(!upstream.ok||!upstream.body){clearTimeout(timeout);abort.abort();throw new ApiError(503,'chat_unavailable');}
  let cancelled=false;const reader=upstream.body.getReader();
  const stream=new ReadableStream({
    async start(output){
      const emit=event=>{if(!cancelled)output.enqueue(encoder.encode(JSON.stringify(event)+'\n'));};
      const decoder=new TextDecoder();let buffer='',text='',finish=null;
      const consume=line=>{line=line.trim();if(!line.startsWith('data:'))return;const data=line.slice(5).trim();if(data==='[DONE]')return;
        const choice=JSON.parse(data).choices?.[0];if(!choice)return;
        if(typeof choice.delta?.content==='string'){text+=choice.delta.content;if(text.length>6000)throw Error('reply_too_long');emit({type:'delta',text:choice.delta.content});}
        if(choice.finish_reason)finish=choice.finish_reason;
      };
      try{
        emit({type:'start'});
        while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let index;
          if(buffer.length>32000)throw Error('invalid_stream');
          while((index=buffer.indexOf('\n'))>=0){consume(buffer.slice(0,index));buffer=buffer.slice(index+1);}}
        buffer+=decoder.decode();if(buffer.trim())consume(buffer);
        if(!text.trim()||finish!=='stop')throw Error('incomplete_reply');
        emit({type:'done',message:{id:crypto.randomUUID(),role:'assistant',content:text.trim(),requestId:body.requestId,createdAt:Date.now()/1000}});
      }catch{emit({type:'error',error:'chat_unavailable'});}
      finally{clearTimeout(timeout);abort.abort();try{await reader.cancel();}catch{}if(!cancelled)output.close();}
    },
    cancel(){cancelled=true;clearTimeout(timeout);abort.abort();return reader.cancel();}
  });
  return new Response(stream,{headers:{...commonHeaders,'Content-Type':'application/x-ndjson; charset=utf-8'}});
}
export async function tencentAuthorization(id,secret,timestamp,payload,service,action){
  const date=new Date(timestamp*1000).toISOString().slice(0,10),host=service+'.tencentcloudapi.com';
  const signed='content-type;host;x-tc-action',headers=`content-type:application/json; charset=utf-8\nhost:${host}\nx-tc-action:${action.toLowerCase()}\n`;
  const canonical=['POST','/','',headers,signed,await sha(payload)].join('\n');const scope=`${date}/${service}/tc3_request`;
  const signText=['TC3-HMAC-SHA256',timestamp,scope,await sha(canonical)].join('\n');
  const key=await hmac(await hmac(await hmac('TC3'+secret,date),service),'tc3_request');
  return `TC3-HMAC-SHA256 Credential=${id}/${scope}, SignedHeaders=${signed}, Signature=${hex(await hmac(key,signText))}`;
}
async function tencent(env,service,action,version,body){
  if(!env.COMPANION_TENCENT_SECRET_ID||!env.COMPANION_TENCENT_SECRET_KEY)throw new ApiError(503,'speech_not_configured');
  const payload=JSON.stringify(body);
  for(let attempt=0;attempt<3;attempt++){
    const timestamp=Math.floor(Date.now()/1000),authorization=await tencentAuthorization(env.COMPANION_TENCENT_SECRET_ID,env.COMPANION_TENCENT_SECRET_KEY,timestamp,payload,service,action);
    let data;
    try{const response=await fetch(`https://${service}.tencentcloudapi.com`,{method:'POST',redirect:'error',signal:AbortSignal.timeout(45000),
      headers:{'Authorization':authorization,'Content-Type':'application/json; charset=utf-8','X-TC-Action':action,'X-TC-Timestamp':String(timestamp),'X-TC-Version':version,'X-TC-Region':env.COMPANION_TENCENT_REGION||'ap-beijing'},body:payload});
      if(!response.ok)throw Error();data=(await response.json()).Response;if(!data)throw Error();}
    catch{throw new ApiError(503,'speech_unavailable');}
    if(!data.Error)return data;
    if(attempt<2&&/^(LimitExceeded|RequestLimitExceeded|InternalError)/.test(data.Error.Code||'')){await new Promise(resolve=>setTimeout(resolve,attempt?900:300));continue;}
    throw new ApiError(503,'speech_unavailable');
  }
}
export function validateWav(encoded){
  if(typeof encoded!=='string'||encoded.length>3*1024*1024)throw new ApiError(413,'audio_too_large');
  if(encoded.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded))throw new ApiError(400,'invalid_audio');
  let bytes;try{bytes=Uint8Array.from(atob(encoded),v=>v.charCodeAt(0));}catch{throw new ApiError(400,'invalid_audio');}
  const view=new DataView(bytes.buffer),ascii=(at,n)=>String.fromCharCode(...bytes.subarray(at,at+n));
  if(bytes.length<44||ascii(0,4)!=='RIFF'||ascii(8,4)!=='WAVE'||view.getUint32(4,true)+8!==bytes.length)throw new ApiError(400,'invalid_audio');
  let validFormat=false,dataSize=0;
  for(let at=12;at+8<=bytes.length;){const size=view.getUint32(at+4,true),start=at+8;if(start+size>bytes.length)throw new ApiError(400,'invalid_audio');
    if(ascii(at,4)==='fmt '){if(size<16)throw new ApiError(400,'invalid_audio');validFormat=view.getUint16(start,true)===1&&view.getUint16(start+2,true)===1&&view.getUint32(start+4,true)===16000&&view.getUint32(start+8,true)===32000&&view.getUint16(start+12,true)===2&&view.getUint16(start+14,true)===16;}
    if(ascii(at,4)==='data')dataSize+=size;
    at=start+size+(size%2);
  }
  if(!validFormat||dataSize%2||dataSize/32000<.25||dataSize/32000>60)throw new ApiError(400,'invalid_audio');return bytes;
}
export async function handleCompanion(request,env){
  try{
    const url=new URL(request.url),path=url.pathname.replace(/^\/api\/companion\/?/,'');
    if(request.method==='GET'&&path==='state'){
      const config=await modelConfig(env),allowed=await authenticated(request,env);
      return json({name:'小忆',authenticated:allowed,chatAvailable:!!env.COMPANION_LLM_API_KEY,chatModel:env.COMPANION_CHAT_MODEL||'gpt-5.6-luna',
        speechAvailable:!!(env.COMPANION_TENCENT_SECRET_ID&&env.COMPANION_TENCENT_SECRET_KEY),asrAvailable:!!(env.COMPANION_TENCENT_SECRET_ID&&env.COMPANION_TENCENT_SECRET_KEY),speechProvider:'tencent',voice:'沉稳男声',
        modelPath:'/api/companion/assets/model/'+config.modelFile,interactionProfile:config.interactionProfile});
    }
    if(request.method==='GET'&&path.startsWith('assets/')){
      const key=path.slice(7);if(!key||key.includes('..')||key.includes('\\'))throw new ApiError(404,'not_found');
      const config=await modelConfig(env);if(!Object.hasOwn(config.files,key))throw new ApiError(404,'not_found');
      const object=await env.MY_BUCKET.get((env.COMPANION_ASSET_PREFIX||ASSET_PREFIX)+'/'+key);if(!object)throw new ApiError(404,'not_found');
      const headers=new Headers({'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'});object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);
      if(request.headers.get('If-None-Match')===object.httpEtag)return new Response(null,{status:304,headers});return new Response(object.body,{headers});
    }
    if(request.method!=='POST')throw new ApiError(405,'method_not_allowed');requireOrigin(request);
    if(path==='session'){
      if(!env.AUTH_PASSWORD)throw new ApiError(503,'access_not_configured');const body=await readJson(request,4096);
      if(typeof body.password!=='string'||await sha(body.password)!==await sha(env.AUTH_PASSWORD))throw new ApiError(401,'invalid_password');
      const token=await createSession(env.AUTH_PASSWORD);
      return json({ok:true},200,{'Set-Cookie':`${COOKIE}=${token}; Path=/api/companion; Max-Age=28800; HttpOnly; SameSite=Strict${url.protocol==='https:'?'; Secure':''}`});
    }
    if(!await authenticated(request,env))throw new ApiError(401,'session_required');
    const body=await readJson(request,path==='transcribe'?3*1024*1024+1024:96000);
    if(path==='chat')return await chatResponse(body,env);
    if(path==='speech'){
      const text=typeof body.text==='string'?body.text.replace(/\[\[[\s\S]*?\]\]/g,'').trim():'';
      if(!text||text.length>150)throw new ApiError(400,'invalid_speech_text');
      const result=await tencent(env,'tts','TextToVoice','2019-08-23',{Text:text,SessionId:crypto.randomUUID(),VoiceType:603006,Codec:'mp3',SampleRate:16000,Volume:0,Speed:0,PrimaryLanguage:1});
      if(typeof result.Audio!=='string'||result.Audio.length<16)throw new ApiError(503,'invalid_speech_audio');return json({audioBase64:result.Audio,mimeType:'audio/mpeg'});
    }
    if(path==='transcribe'){
      const data=validateWav(body.audio),result=await tencent(env,'asr','SentenceRecognition','2019-06-14',{EngSerViceType:'16k_zh',SourceType:1,VoiceFormat:'wav',ProjectId:0,SubServiceType:2,UsrAudioKey:crypto.randomUUID(),Data:body.audio,DataLen:data.length,WordInfo:0,FilterDirty:0,FilterModal:0,FilterPunc:0,ConvertNumMode:1});
      if(typeof result.Result!=='string'||!result.Result.trim())throw new ApiError(503,'no_speech_detected');return json({text:result.Result.trim().slice(0,MAX_TEXT)});
    }
    throw new ApiError(404,'not_found');
  }catch(error){return json({error:error instanceof ApiError?error.message:'service_unavailable'},error instanceof ApiError?error.status:503);}
}
