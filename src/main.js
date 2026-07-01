import './style.css';
import Sortable from 'sortablejs';

// ==========================================
// Custom UI Utils (Toasts & Modals)
// ==========================================
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function showModal(title, message, isPrompt = false, defaultValue = '') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('custom-modal-overlay');
        const titleEl = document.getElementById('modal-title');
        const msgEl = document.getElementById('modal-message');
        const inputEl = document.getElementById('modal-input');
        const btnCancel = document.getElementById('modal-cancel');
        const btnConfirm = document.getElementById('modal-confirm');

        titleEl.innerText = title;
        msgEl.innerText = message;
        
        if (isPrompt) {
            inputEl.style.display = 'block';
            inputEl.value = defaultValue;
            inputEl.focus();
        } else {
            inputEl.style.display = 'none';
        }

        overlay.style.display = 'flex';

        const cleanup = () => {
            overlay.style.display = 'none';
            btnCancel.onclick = null;
            btnConfirm.onclick = null;
        };

        btnCancel.onclick = () => {
            cleanup();
            resolve(isPrompt ? null : false);
        };

        btnConfirm.onclick = () => {
            cleanup();
            resolve(isPrompt ? inputEl.value : true);
        };
    });
}

// ==========================================
// Anniversary Petals Logic
// ==========================================
function checkAnniversary() {
    const today = new Date();
    if (today.getMonth() === startDate.getMonth() && today.getDate() === startDate.getDate()) {
        startPetals();
    }
}

function startPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;
    
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        petal.style.left = Math.random() * 100 + 'vw';
        
        petal.style.setProperty('--end-x', (Math.random() * 200 - 100) + 'px');
        petal.style.setProperty('--end-rotation', (Math.random() * 720) + 'deg');
        
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        container.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 8000);
    }, 300);
}

// ==========================================
// Hidden Birthday Surprise
// ==========================================
const birthdayLetterParagraphs = [
    '宝宝，生日快乐呀。',
    '我把这封信藏在我们的网站里，是因为我想让今天先像一个小秘密一样，轻轻落到你手心里。朱梓萌你好呀，今天所有的蜡烛、星星、照片和这封慢慢出现的信，都只想认真说一句：生日快乐。',
    '我还记得 6.10 那天，和朱梓萌玩了一整天。宝宝那天真的好可爱，黑丝短袖，裤子带着竖线条纹，宽宽松松，却把宝宝衬得身材好好。刚见到你的时候我就在想：朱梓萌怎么超级超级漂亮呀。',
    '那天我真的超级开心，能第一次线下给宝宝过生日，好像连空气都变甜了一点。结束之后你还跟我说，和我在一起好开心。听到这句话的时候我心里直接 yes！！亲亲亲，mua～～',
    '宝宝还记不记得我们讨论生日礼物的时候？其实我很早就想把你说过的那个 ccd 送给你。可惜你第一次跟我说的时候，我还没有那么多钱；后来有钱了，又一直缺一个合适的机会。',
    '刚好生日想给朱梓萌送，可朱梓萌竟然已经不喜欢了。那一刻感觉高中学的诗都意象化了呀宝宝：树欲静而风不止，物欲送而心意已。但是作为朱梓萌头号粉丝，我一定会想到一个真正合适的礼物送给宝宝。',
    '21 号那天，朱梓萌小朋友怎么这么乘乘的，怎么帮我还了这么多钱。小朱梓萌怎么这么可爱，么么哒。宝宝不用那么担心吕豪杰哦，没钱了我会跟你说的，爱你哦宝宝。',
    '我们在一起这么久，宝宝还是会担心我过得好不好。其实我想说，只要我们还在一起，我就是幸福的。虽然但是，还是好怀念和宝宝呆在一起的时间，看着宝宝能开心地笑出来，我感觉整个世界都明朗了。',
    '朱梓萌像是上天派来拯救我的天使，那么明亮，那么有活力。也许朱梓萌不是给我而生，可我却有幸和朱梓萌相伴，度过彼此最艰难的时间。我们都会有美好的未来。',
    '朱梓萌同学，我好想你。时间越推越久，看着以前我们的合照，还是会好开心我们有这么多一起的回忆。那么多年前加上朱梓萌的 QQ，你那时候就好活泼，我都惊讶为什么你对我这么好，还会专门等我打游戏。',
    '后来我才明白，原来宝宝就是一个很乘乘、很温柔、很可爱的人。我好喜欢朱梓萌。新的一岁，愿你平安、明亮、自由，也愿我能陪你把很多未来慢慢走成回忆。'
];

const birthdayPhotos = [
    {
        src: '/birthday/photo-1.jpg',
        caption: '抓到可爱宝宝一只',
        layout: 'portrait'
    },
    {
        src: '/birthday/photo-2.jpg',
        caption: '所有人心跳停止，聆听宝宝的心愿！',
        layout: 'landscape'
    },
    {
        src: '/birthday/photo-3.jpg',
        caption: '我的全世界竟然就在我身边😱',
        layout: 'portrait'
    },
    {
        src: '/birthday/photo-4.jpg',
        caption: '迪士尼在逃公主在我面前吃小蛋糕，不管了，先拍一张📷',
        layout: 'tall'
    }
];

let birthdaySecretClicks = 0;
let birthdayTypingTimer = null;
let birthdayParagraphIndex = 0;
let birthdayPhotoIndex = 0;
let birthdayMicStream = null;
let birthdayAudioContext = null;
let birthdayMicFrame = null;

function setBirthdayStep(stepIndex) {
    const panels = document.querySelectorAll('[data-birthday-panel]');
    const dots = document.querySelectorAll('.birthday-progress span');

    panels.forEach(panel => {
        panel.classList.toggle('active', Number(panel.dataset.birthdayPanel) === stepIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === stepIndex);
    });

    if (stepIndex !== 3) {
        stopBirthdayMic();
    }

    if (stepIndex === 5) {
        beginBirthdayLetter();
    }
}

function resetBirthdayFlow() {
    clearInterval(birthdayTypingTimer);
    birthdayTypingTimer = null;
    birthdayParagraphIndex = 0;
    birthdayPhotoIndex = 0;
    stopBirthdayMic();

    const wish = document.getElementById('birthday-wish');
    const tokenNext = document.getElementById('birthday-token-next');
    const candleNext = document.getElementById('birthday-candle-next');
    const envelope = document.getElementById('birthday-envelope');
    const letterBody = document.getElementById('birthday-letter-body');
    const letterNext = document.getElementById('birthday-letter-next');
    const blowStatus = document.getElementById('birthday-blow-status');

    if (wish) wish.value = '';
    document.querySelectorAll('.wish-token').forEach(token => token.classList.remove('selected'));
    document.querySelectorAll('.birthday-candle').forEach(candle => candle.classList.remove('blown'));
    if (tokenNext) tokenNext.disabled = true;
    if (candleNext) candleNext.disabled = true;
    if (blowStatus) blowStatus.innerText = '麦克风没开也没关系，点烛火也可以吹灭。';
    updateBirthdayPhoto();
    if (envelope) envelope.classList.remove('open');
    if (letterBody) letterBody.innerHTML = '';
    if (letterNext) {
        letterNext.disabled = false;
        letterNext.innerText = '下一句';
    }

    setBirthdayStep(0);
}

function updateBirthdayPhoto() {
    const photo = document.getElementById('birthday-photo');
    const caption = document.getElementById('birthday-photo-caption');
    const count = document.getElementById('birthday-photo-count');
    const nextButton = document.getElementById('birthday-photo-next');
    const card = document.getElementById('birthday-photo-card');
    const current = birthdayPhotos[birthdayPhotoIndex];

    if (!photo || !caption || !count || !nextButton || !current) return;

    card?.classList.remove('flipped', 'portrait', 'landscape', 'tall');
    void card?.offsetWidth;
    card?.classList.add('flipped', current.layout);

    photo.src = current.src;
    photo.alt = `生日照片 ${birthdayPhotoIndex + 1}`;
    caption.innerText = current.caption;
    count.innerText = `${birthdayPhotoIndex + 1} / ${birthdayPhotos.length}`;
    nextButton.innerText = birthdayPhotoIndex === birthdayPhotos.length - 1 ? '继续许愿' : '下一张';
}

function openBirthdaySurprise() {
    const surprise = document.getElementById('birthday-surprise');
    if (!surprise) return;

    resetBirthdayFlow();
    surprise.classList.add('active');
    surprise.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeBirthdaySurprise() {
    const surprise = document.getElementById('birthday-surprise');
    if (!surprise) return;

    clearInterval(birthdayTypingTimer);
    birthdayTypingTimer = null;
    stopBirthdayMic();
    surprise.classList.remove('active');
    surprise.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function startBirthdayConfetti(amount = 24) {
    const colors = ['#f4c76d', '#e99a90', '#96c2b2', '#fff5e0', '#d9a4b1'];

    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement('span');
        confetti.className = 'birthday-confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 1.8 + 2.8}s`;
        confetti.style.animationDelay = `${Math.random() * 0.35}s`;
        confetti.style.setProperty('--confetti-drift', `${Math.random() * 220 - 110}px`);
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5200);
    }
}

function beginBirthdayLetter() {
    const letterBody = document.getElementById('birthday-letter-body');
    const nextButton = document.getElementById('birthday-letter-next');
    if (!letterBody || !nextButton) return;

    clearInterval(birthdayTypingTimer);
    birthdayParagraphIndex = 0;
    letterBody.innerHTML = '';
    nextButton.innerText = '下一句';
    typeBirthdayParagraph();
}

function typeBirthdayParagraph() {
    const letterBody = document.getElementById('birthday-letter-body');
    const nextButton = document.getElementById('birthday-letter-next');
    if (!letterBody || !nextButton) return;

    clearInterval(birthdayTypingTimer);
    nextButton.disabled = true;

    const paragraphText = birthdayLetterParagraphs[birthdayParagraphIndex];
    const paragraph = document.createElement('p');
    letterBody.appendChild(paragraph);

    let charIndex = 0;
    birthdayTypingTimer = setInterval(() => {
        paragraph.textContent = paragraphText.slice(0, charIndex + 1);
        letterBody.scrollTop = letterBody.scrollHeight;
        charIndex++;

        if (charIndex >= paragraphText.length) {
            clearInterval(birthdayTypingTimer);
            birthdayTypingTimer = null;
            nextButton.disabled = false;
            nextButton.innerText = birthdayParagraphIndex === birthdayLetterParagraphs.length - 1 ? '收好这封信' : '下一句';
        }
    }, 42);
}

function updateBirthdayBlowStatus(message) {
    const status = document.getElementById('birthday-blow-status');
    if (status) status.innerText = message;
}

function stopBirthdayMic() {
    if (birthdayMicFrame) {
        cancelAnimationFrame(birthdayMicFrame);
        birthdayMicFrame = null;
    }

    if (birthdayMicStream) {
        birthdayMicStream.getTracks().forEach(track => track.stop());
        birthdayMicStream = null;
    }

    if (birthdayAudioContext && birthdayAudioContext.state !== 'closed') {
        birthdayAudioContext.close();
    }
    birthdayAudioContext = null;

    const meter = document.getElementById('birthday-blow-meter');
    const micButton = document.getElementById('birthday-mic-btn');
    if (meter) meter.style.width = '0%';
    if (micButton) {
        micButton.disabled = false;
        micButton.innerText = '打开麦克风吹蜡烛';
    }
}

function finishBirthdayCandles(message = '蜡烛吹灭啦，许愿完成。') {
    const candleNext = document.getElementById('birthday-candle-next');
    const candles = Array.from(document.querySelectorAll('.birthday-candle'));
    const shouldCelebrate = candleNext?.disabled ?? true;

    candles.forEach(candle => candle.classList.add('blown'));
    stopBirthdayMic();
    updateBirthdayBlowStatus(message);
    if (candleNext) candleNext.disabled = false;
    if (shouldCelebrate) startBirthdayConfetti(22);
}

function checkBirthdayCandles() {
    const candleNext = document.getElementById('birthday-candle-next');
    const candles = Array.from(document.querySelectorAll('.birthday-candle'));
    const remaining = candles.filter(candle => !candle.classList.contains('blown')).length;

    if (remaining === 0) {
        finishBirthdayCandles('烛火都灭啦，宝宝的心愿正在生效。');
        return;
    }

    updateBirthdayBlowStatus(`还剩 ${remaining} 簇烛火，可以继续点，也可以打开麦克风吹一下。`);
}

async function startBirthdayMic() {
    const micButton = document.getElementById('birthday-mic-btn');
    const meter = document.getElementById('birthday-blow-meter');
    if (birthdayMicStream) return;

    if (!navigator.mediaDevices?.getUserMedia) {
        updateBirthdayBlowStatus('这个浏览器暂时不能用麦克风，直接点烛火也可以。');
        return;
    }

    try {
        if (micButton) {
            micButton.disabled = true;
            micButton.innerText = '正在打开麦克风...';
        }
        updateBirthdayBlowStatus('麦克风打开后，对着它轻轻吹一下。');

        birthdayMicStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });
        birthdayAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = birthdayAudioContext.createMediaStreamSource(birthdayMicStream);
        const analyser = birthdayAudioContext.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);

        const samples = new Uint8Array(analyser.fftSize);
        let loudFrames = 0;
        if (micButton) {
            micButton.disabled = false;
            micButton.innerText = '正在听宝宝吹气';
        }

        const listen = () => {
            analyser.getByteTimeDomainData(samples);
            let sum = 0;
            samples.forEach(sample => {
                const centered = (sample - 128) / 128;
                sum += centered * centered;
            });
            const volume = Math.sqrt(sum / samples.length);
            if (meter) meter.style.width = `${Math.min(100, Math.round(volume * 380))}%`;

            if (volume > 0.16) {
                loudFrames++;
            } else {
                loudFrames = Math.max(0, loudFrames - 1);
            }

            if (loudFrames >= 3) {
                finishBirthdayCandles('收到宝宝的风啦，蜡烛一下子全灭了。');
                return;
            }

            birthdayMicFrame = requestAnimationFrame(listen);
        };

        birthdayMicFrame = requestAnimationFrame(listen);
    } catch (error) {
        stopBirthdayMic();
        updateBirthdayBlowStatus('麦克风没有打开，直接点烛火也可以吹灭。');
    }
}

function initBirthdaySurprise() {
    const surprise = document.getElementById('birthday-surprise');
    const trigger = document.getElementById('secret-birthday-trigger');
    if (!surprise || surprise.dataset.ready === 'true') return;
    surprise.dataset.ready = 'true';

    trigger?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        birthdaySecretClicks++;

        if (birthdaySecretClicks < 3) {
            showToast(`第 ${birthdaySecretClicks} 颗星星被点亮`);
            return;
        }

        birthdaySecretClicks = 0;
        openBirthdaySurprise();
    });

    document.getElementById('birthday-start-btn')?.addEventListener('click', () => {
        const wish = document.getElementById('birthday-wish')?.value.trim();
        if (wish) {
            sessionStorage.setItem('zhuzimengBirthdayWish', wish);
        }
        startBirthdayConfetti(12);
        setBirthdayStep(1);
    });

    const tokenNext = document.getElementById('birthday-token-next');
    const tokens = Array.from(document.querySelectorAll('.wish-token'));
    tokens.forEach(token => {
        token.addEventListener('click', () => {
            token.classList.toggle('selected');
            const allSelected = tokens.every(item => item.classList.contains('selected'));
            if (tokenNext) tokenNext.disabled = !allSelected;
        });
    });

    tokenNext?.addEventListener('click', () => {
        startBirthdayConfetti(10);
        setBirthdayStep(2);
    });

    document.getElementById('birthday-photo-next')?.addEventListener('click', () => {
        if (birthdayPhotoIndex < birthdayPhotos.length - 1) {
            birthdayPhotoIndex++;
            updateBirthdayPhoto();
            startBirthdayConfetti(8);
            return;
        }

        startBirthdayConfetti(14);
        setBirthdayStep(3);
    });

    document.getElementById('birthday-photo-card')?.addEventListener('click', () => {
        document.getElementById('birthday-photo-next')?.click();
    });

    const candleNext = document.getElementById('birthday-candle-next');
    const candles = Array.from(document.querySelectorAll('.birthday-candle'));
    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            candle.classList.add('blown');
            checkBirthdayCandles();
        });
    });

    document.getElementById('birthday-mic-btn')?.addEventListener('click', startBirthdayMic);

    candleNext?.addEventListener('click', () => {
        setBirthdayStep(4);
    });

    document.getElementById('birthday-envelope')?.addEventListener('click', (event) => {
        const envelope = event.currentTarget;
        envelope.classList.add('open');
        startBirthdayConfetti(26);
        setTimeout(() => {
            setBirthdayStep(5);
        }, 650);
    });

    document.getElementById('birthday-letter-next')?.addEventListener('click', () => {
        if (birthdayTypingTimer) return;

        if (birthdayParagraphIndex < birthdayLetterParagraphs.length - 1) {
            birthdayParagraphIndex++;
            typeBirthdayParagraph();
            return;
        }

        startBirthdayConfetti(40);
        const nextButton = document.getElementById('birthday-letter-next');
        if (nextButton) {
            nextButton.innerText = '生日快乐';
            nextButton.disabled = true;
        }
    });

    if (new URLSearchParams(window.location.search).get('birthday') === '1' || window.location.hash === '#birthday') {
        setTimeout(openBirthdaySurprise, 450);
    }
}

// ==========================================
// 在这里修改你们的恋爱起始日期 (格式: YYYY-MM-DDTHH:mm:ss)
// ==========================================
const startDate = new Date('2025-05-02T19:06:00');

// 导航栏点击切换视图逻辑
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);

        // 更新导航栏高亮
        document.querySelectorAll('nav ul li a').forEach(a => {
            a.classList.remove('active-nav');
        });
        this.classList.add('active-nav');

        if (targetId === 'hero') {
            // 返回首页（便当盒网格）
            document.body.classList.remove('view-single');
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('active');
                card.style.transform = '';
            });
        } else {
            // 进入单页视图
            document.body.classList.add('view-single');
            document.querySelectorAll('.card').forEach(card => {
                card.style.transform = '';
                if (card.id === targetId) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) return; // 如果日期在未来，不处理

    // 计算年份和天数
    const date1 = new Date(startDate);
    const date2 = new Date(now);

    let years = date2.getFullYear() - date1.getFullYear();

    // 检查是否还没到今年的纪念日
    const currentYearAnniversary = new Date(startDate);
    currentYearAnniversary.setFullYear(date2.getFullYear());

    if (date2 < currentYearAnniversary) {
        years--;
    }

    // 计算整年后的日期
    const yearDate = new Date(startDate);
    yearDate.setFullYear(yearDate.getFullYear() + years);

    // 剩余的毫秒数
    let remainingMs = now - yearDate;

    const daysMs = 1000 * 60 * 60 * 24;
    const hoursMs = 1000 * 60 * 60;
    const minutesMs = 1000 * 60;
    const secondsMs = 1000;

    const days = Math.floor(remainingMs / daysMs);
    remainingMs -= days * daysMs;

    const hours = Math.floor(remainingMs / hoursMs);
    remainingMs -= hours * hoursMs;

    const minutes = Math.floor(remainingMs / minutesMs);
    remainingMs -= minutes * minutesMs;

    const seconds = Math.floor(remainingMs / secondsMs);

    document.getElementById('years').innerText = years;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}

// 初始调用并设置定时器
updateTimer();
setInterval(updateTimer, 1000);

// ==========================================
// 动态交互效果
// ==========================================
const glow = document.getElementById('mouse-glow');

document.addEventListener('mousemove', (e) => {
    if (glow) {
        glow.style.opacity = '1';
        requestAnimationFrame(() => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }
});

document.addEventListener('mouseleave', () => {
    if (glow) glow.style.opacity = '0';
});

// 卡片 3D 悬浮效果
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        if (document.body.classList.contains('view-single')) return; // 单页模式下不应用3D

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 限制旋转角度
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    });

    card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});

// 点击出现爱心特效
document.addEventListener('click', function (e) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = '❤';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 800);
});

// Lightbox 图片点击放大预览逻辑
document.addEventListener('click', function (e) {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
        openLightbox(e.target);
    }
});

function openLightbox(mediaElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');

    if (mediaElement.tagName === 'IMG') {
        lightboxImg.src = mediaElement.src;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
    } else if (mediaElement.tagName === 'VIDEO') {
        lightboxVideo.src = mediaElement.src;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxVideo.play();
    }

    lightbox.style.display = 'flex';
    // 强制回流以触发淡入动画
    void lightbox.offsetWidth;
    lightbox.classList.add('active');
}

function closeLightbox(e) {
    // 如果点击的是图片或视频本身，不关闭
    if (e && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    lightbox.classList.remove('active');

    setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
            lightbox.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.removeAttribute('src');
            document.getElementById('lightbox-img').removeAttribute('src');
        }
    }, 300);
}

// ==========================================
// 验证与编辑模式逻辑 / Cloudflare R2 配置
// ==========================================
const r2PublicUrl = import.meta.env.VITE_R2_PUBLIC_URL || '';

async function loadDataFromCOS() {
    try {
        const url = `/api/data?t=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.log("尚无云端数据文件，或加载失败");
            return;
        }
        
        const text = await response.text();
        const trimmedText = text.trim();
        if (!trimmedText || trimmedText.startsWith('<')) {
            console.log("尚无云端数据文件，或本地开发环境未启用 Functions");
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(trimmedText);
        } catch (e) {
            console.error("无法解析云端数据", e);
            return;
        }

        if (parsed.timeline) document.querySelector('.timeline').innerHTML = parsed.timeline;
        if (parsed.gallery) document.querySelector('.gallery-grid').innerHTML = parsed.gallery;
        if (parsed.bucketList) document.querySelector('.bucket-list').innerHTML = parsed.bucketList;

        document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    } catch (e) {
        console.error("加载云端数据时发生错误", e);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkAnniversary();
    loadDataFromCOS();
    initBirthdaySurprise();

    // 默认移除所有可编辑属性，确保仅浏览模式安全
    document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    // 本地图片/视频上传逻辑
    const localImgUpload = document.getElementById('local-img-upload');
    if (localImgUpload) {
        localImgUpload.addEventListener('change', async function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const isVideo = file.type.startsWith('video/');
            const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
            const filename = `media_${Date.now()}.${ext}`;

            const container = document.querySelector('.gallery-grid');
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#888;">上传云端中...</div>`;
            container.appendChild(item);

            const authPassword = document.getElementById('auth-answer').value;
            const uploadUrl = `/api/upload?key=photos/${filename}`;

            fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': authPassword
                },
                body: file
            }).then(async response => {
                if (!response.ok) throw new Error('Upload failed');
                const fileUrl = `${r2PublicUrl}/photos/${filename}`;
                if (isVideo) {
                    item.innerHTML = `<video src="${fileUrl}" autoplay loop muted playsinline referrerPolicy="no-referrer"></video>`;
                } else {
                    item.innerHTML = `<img src="${fileUrl}" alt="Memory" referrerPolicy="no-referrer">`;
                }
                makeEditable(item);
            }).catch(err => {
                console.error(err);
                item.remove();
                showToast("网络错误，文件上传失败");
            });

            this.value = '';
        });
    }
});

async function verifyAuth() {
    const ans = document.getElementById('auth-answer').value;
    const btn = document.querySelector('.auth-buttons .btn-primary');
    const originalText = btn.innerText;
    btn.innerText = '验证中...';
    btn.disabled = true;

    try {
        // 验证密码是否正确
        const res = await fetch('/api/auth', {
            headers: { 'Authorization': ans }
        });
        
        let isSuccess = false;
        if (res.ok) {
            try {
                const data = await res.json();
                if (data.success) isSuccess = true;
            } catch (e) {
                console.warn("API 没有返回 JSON，可能是本地服务器没有运行 Functions:", e);
            }
        }

        if (isSuccess) {
            document.getElementById('auth-overlay').style.display = 'none';
            enableEditMode();
        } else {
            document.getElementById('auth-error').style.display = 'block';
            document.getElementById('auth-error').innerText = '密码错误或后端环境未就绪';
        }
    } catch (e) {
        console.error(e);
        document.getElementById('auth-error').style.display = 'block';
        document.getElementById('auth-error').innerText = '网络错误，请稍后再试';
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function skipAuth() {
    document.getElementById('auth-overlay').style.display = 'none';
}

function enableEditMode() {
    document.body.classList.add('edit-mode');
    makeEditable(document);
    
    // 激活画廊拖拽
    const gallery = document.querySelector('.gallery-grid');
    if (gallery && !gallery.sortableInstance) {
        gallery.sortableInstance = new Sortable(gallery, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            delay: 200, // 移动端长按才触发拖拽，防止误触
            delayOnTouchOnly: true
        });
    }
}

function makeEditable(element) {
    // 开启文本编辑
    const editableSelectors = ['.timeline-date', '.timeline-title', '.timeline-content p', '.task'];
    editableSelectors.forEach(sel => {
        element.querySelectorAll(sel).forEach(el => el.setAttribute('contenteditable', 'true'));
    });

    // 开启故事点击删除功能
    const timelineItems = element.classList && element.classList.contains('timeline-item') ? [element] : element.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const oldDelBtn = item.querySelector('.delete-btn');
        if (oldDelBtn) oldDelBtn.remove();

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = async function (e) {
            e.stopPropagation();
            if (await showModal('删除故事', '确定要删除这个故事吗？')) {
                item.remove();
            }
        };
        item.appendChild(delBtn);
    });

    // 开启图片点击替换及删除功能
    const galleryItems = element.classList && element.classList.contains('gallery-item') ? [element] : element.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        // 先移除可能从云端加载的无事件绑定的旧按钮
        const oldDelBtn = item.querySelector('.delete-btn');
        if (oldDelBtn) oldDelBtn.remove();
        const oldEditBtn = item.querySelector('.edit-btn');
        if (oldEditBtn) oldEditBtn.remove();

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = async function (e) {
            e.stopPropagation();
            if (await showModal('删除影像', '确定要删除这个影像吗？')) {
                const mediaObj = item.querySelector('img, video');
                const mediaSrc = mediaObj ? mediaObj.src : '';
                item.remove(); // 立即在界面删除

                // 如果是云端上的影像，顺便从云端物理删除它释放空间
                if (mediaSrc.includes(r2PublicUrl) || mediaSrc.includes('r2.dev') || mediaSrc.includes('myqcloud.com')) {
                    try {
                        const urlObj = new URL(mediaSrc);
                        let key = decodeURIComponent(urlObj.pathname.substring(1)); // removes leading '/'

                        const ans = document.getElementById('auth-answer').value;
                        fetch(`/api/delete?key=${key}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': ans }
                        }).then(res => {
                            if (!res.ok) console.error("无法删除云端文件");
                        }).catch(err => console.error("无法删除云端文件", err));
                    } catch (err) {
                        console.error("无法删除云端文件", err);
                    }
                }
            }
        };
        item.appendChild(delBtn);

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '✎';
        editBtn.onclick = async function (e) {
            e.stopPropagation();
            const media = item.querySelector('img, video');
            if (media) {
                const newUrl = await showModal('编辑影像', '请输入新的影像链接 (URL)\n(如需本地文件，请删除此项后重新添加)', true, media.src);
                if (newUrl) media.src = newUrl;
            }
        };
        item.appendChild(editBtn);
    });

    // 开启心愿单点击切换状态及删除
    const items = element.classList && element.classList.contains('bucket-item') ? [element] : element.querySelectorAll('.bucket-item');
    items.forEach(item => {
        const checkbox = item.querySelector('.checkbox');
        if (checkbox) {
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            newCheckbox.addEventListener('click', function () {
                if (!document.body.classList.contains('edit-mode')) return;
                item.classList.toggle('completed');
            });
        }
        
        // 添加心愿单删除按钮
        const oldDelBtn = item.querySelector('.delete-btn');
        if (oldDelBtn) oldDelBtn.remove();

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = async function (e) {
            e.stopPropagation();
            if (await showModal('删除心愿', '确定要删除这个心愿吗？')) {
                item.remove();
            }
        };
        item.appendChild(delBtn);
    });
}

function addTimelineItem() {
    const container = document.querySelector('.timeline');
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <div class="timeline-date">新日期</div>
            <h3 class="timeline-title">新故事标题</h3>
            <p>在这里写下你们的新故事...</p>
        </div>
    `;
    container.appendChild(item);
    makeEditable(item);
}

function addGalleryItem() {
    const container = document.querySelector('.gallery-grid');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="https://picsum.photos/seed/new${Date.now()}/400/400" alt="New Memory" referrerPolicy="no-referrer">`;
    container.appendChild(item);
    makeEditable(item);
}

function addBucketItem() {
    const container = document.querySelector('.bucket-list');
    const item = document.createElement('div');
    item.className = 'bucket-item';
    item.innerHTML = `
        <div class="checkbox"></div>
        <div class="task">新心愿</div>
    `;
    container.appendChild(item);
    makeEditable(item);
}

async function saveEdits() {
    const btn = document.getElementById('save-btn');
    const originalText = btn.innerText;
    btn.innerText = '正在保存到云端...';
    btn.disabled = true;

    // 保存前暂时移除 contenteditable 属性以保持 HTML 干净
    document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    const dataObj = {
        timeline: document.querySelector('.timeline').innerHTML,
        gallery: document.querySelector('.gallery-grid').innerHTML,
        bucketList: document.querySelector('.bucket-list').innerHTML
    };

    const contentJSON = JSON.stringify(dataObj);

    const ans = document.getElementById('auth-answer').value;
    fetch(`/api/upload?key=data.json`, {
        method: 'PUT',
        headers: { 'Authorization': ans },
        body: contentJSON
    }).then(res => {
        if (res.ok) {
            showToast('修改已成功保存到云端！');
        } else {
            showToast('网络错误，保存失败');
        }
    }).catch(err => {
        console.error(err);
        showToast('网络错误，保存失败');
    }).finally(() => {
        // 恢复 contenteditable
        enableEditMode();
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

// Expose functions to global scope for HTML onclick attributes
window.verifyAuth = verifyAuth;
window.skipAuth = skipAuth;
window.saveEdits = saveEdits;
window.addTimelineItem = addTimelineItem;
window.addGalleryItem = addGalleryItem;
window.addBucketItem = addBucketItem;
window.closeLightbox = closeLightbox;
window.openBirthdaySurprise = openBirthdaySurprise;
window.closeBirthdaySurprise = closeBirthdaySurprise;

// ==========================================
// Virtual Pet (Bongo Cat) Logic via PixiJS
// ==========================================
import * as PIXI from 'pixi.js';
// 必须在模块顶层抛出给全局，以供动态导入的 pixi-live2d-display 使用
window.PIXI = PIXI;

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // 使用针对 Cubism 3/4 的专属入口，避免报错缺少 Cubism 2 的 live2d.min.js 运行时
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');

        const canvas = document.getElementById('live2d-canvas');
        if (!canvas) return;

        // 初始化 Pixi 引擎
        const app = new PIXI.Application({
            view: canvas,
            transparent: true,
            autoStart: true,
            width: 300,
            height: 300,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        // 加载本地 Bongo Cat 模型
        const model = await Live2DModel.from('/models/bongo-cat/cat.model3.json');

        app.stage.addChild(model);
        app.stage.interactiveChildren = false;
        model.interactive = false;
        model.interactiveChildren = false;

        // 调整 Bongo Cat 的大小和位置
        model.scale.set(0.12); // Bongo Cat 模型通常比较大，缩小以适应画布
        model.x = 0;
        model.y = 0;

        // 启用全局视线追踪 (盯着鼠标看)
        window.addEventListener('mousemove', (event) => {
            model.focus(event.clientX, event.clientY);
        });

        const wrapper = document.getElementById('live2d-wrapper');
        const hitbox = document.getElementById('live2d-hitbox');

        // 绑定“拖拽”与“抚摸”事件
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        const dragTarget = wrapper || canvas;
        const interactionTarget = hitbox || canvas;

        interactionTarget.addEventListener('mousedown', (e) => {
            e.preventDefault(); // 防止拖拽选中等默认行为
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;

            // 获取当前真实位置，并解除 right/bottom 的锁定，转换为 left/top 以便拖动
            const rect = dragTarget.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            dragTarget.style.bottom = 'auto';
            dragTarget.style.right = 'auto';
            dragTarget.style.left = initialLeft + 'px';
            dragTarget.style.top = initialTop + 'px';

            const onMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                // 只有移动超过 5 像素才判定为拖拽（防止点击手抖）
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    isDragging = true;
                    dragTarget.style.left = (initialLeft + dx) + 'px';
                    dragTarget.style.top = (initialTop + dy) + 'px';
                    // 拖拽时取消动画缓冲，并稍微放大以提示抓起状态
                    dragTarget.style.transition = 'none';
                    dragTarget.style.transform = 'scale(1.05)';
                    interactionTarget.classList.add('grabbing');
                }
            };

            const onMouseUp = (upEvent) => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);

                interactionTarget.classList.remove('grabbing');
                dragTarget.style.transform = 'scale(1)';
                dragTarget.style.transition = 'transform 0.1s ease-out';

                // 如果没有拖动，说明是“点击/抚摸”
                if (!isDragging) {
                    try {
                        const randomMotion = Math.floor(Math.random() * 2);
                        if (model.internalModel && model.internalModel.motionManager) {
                            model.internalModel.motionManager.startMotion('CAT_motion', randomMotion, 2);
                        } else {
                            model.motion('CAT_motion', randomMotion);
                        }
                    } catch (err) {
                        console.warn("播放动作失败:", err);
                    }

                    // Q弹反馈
                    dragTarget.style.transform = 'scale(0.95) translateY(10px)';
                    setTimeout(() => {
                        dragTarget.style.transform = 'scale(1) translateY(0)';
                    }, 100);

                    // 飘心特效
                    const heart = document.createElement('div');
                    heart.innerHTML = '❤️';
                    heart.className = 'floating-heart';
                    heart.style.left = `${upEvent.clientX - 10}px`;
                    heart.style.top = `${upEvent.clientY - 20}px`;
                    document.body.appendChild(heart);

                    setTimeout(() => {
                        heart.remove();
                    }, 1000);
                }
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });

    } catch (error) {
        console.error("加载 Bongo Cat 失败:", error);
    }
});
