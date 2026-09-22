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
// 在这里修改你们的恋爱起始日期 (格式: YYYY-MM-DDTHH:mm:ss)
// ==========================================
const startDate = new Date('2025-05-02T19:06:00');

// 导航栏点击切换视图逻辑
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href?.startsWith('#')) return;
        e.preventDefault();
        const targetId = href.substring(1);

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
