import {handleCompanion} from '../../../server/companion.mjs';
export const onRequest = ({request, env}) => handleCompanion(request, env);
