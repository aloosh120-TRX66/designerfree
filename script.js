// متغيرات عامة
let firstImageFile = null;
let secondImageFile = null;
let resultImageData = null;

// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    checkButtonState();
    setupToastSystem();
});

// إعداد السحب والإفلات
function setupDragAndDrop() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        const inputId = e.currentTarget.querySelector('input[type="file"]').id;
        const file = files[0];
        
        // تحديد نوع الصورة والمعاينة
        if (inputId === 'firstImage') {
            firstImageFile = file;
            previewImage('firstImage', 'firstPreview', file);
        } else if (inputId === 'secondImage') {
            secondImageFile = file;
            previewImage('secondImage', 'secondPreview', file);
        }
        
        checkButtonState();
    }
}

// اختيار الملف
function selectFile(inputId) {
    document.getElementById(inputId).click();
}

// معاينة الصورة
function previewImage(inputId, previewId, file = null) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    const selectedFile = file || (input.files && input.files[0]);
    
    if (selectedFile) {
        // تحديث المتغيرات العامة
        if (inputId === 'firstImage') {
            firstImageFile = selectedFile;
        } else if (inputId === 'secondImage') {
            secondImageFile = selectedFile;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const polaroidFrame = createPolaroidFrame(e.target.result, selectedFile.name);
            preview.innerHTML = polaroidFrame;
            preview.style.display = 'block';
            
            // تأثير الظهور
            setTimeout(() => {
                preview.style.opacity = '1';
                preview.style.transform = 'translateY(0)';
            }, 100);
        };
        reader.readAsDataURL(selectedFile);
        
        checkButtonState();
    }
}

// إنشاء إطار البولارويد
function createPolaroidFrame(imageSrc, fileName) {
    return `
        <div class="polaroid-frame floating-animation">
            <img src="${imageSrc}" alt="معاينة الصورة">
            <div class="polaroid-caption">${fileName.substring(0, 20)}...</div>
        </div>
    `;
}

// التحقق من حالة الزر
function checkButtonState() {
    const mergeButton = document.getElementById('mergeButton');
    const hasImages = firstImageFile && secondImageFile;
    
    mergeButton.disabled = !hasImages;
    
    if (hasImages) {
        mergeButton.classList.add('animate-pulse');
    } else {
        mergeButton.classList.remove('animate-pulse');
    }
}

// التمرير إلى قسم الرفع
function scrollToUpload() {
    document.getElementById('upload-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// عرض العرض التوضيحي
function showDemo() {
    showToast('info', 'قريباً', 'العرض التوضيحي سيكون متاحاً قريباً!');
}

// دمج الصور
function mergeImages() {
    if (!firstImageFile || !secondImageFile) {
        showToast('error', 'خطأ', 'يرجى رفع الصورتين أولاً');
        return;
    }
    
    // إظهار تحذير API
    showModal('apiWarning');
    
    // محاكاة العملية
    setTimeout(() => {
        closeModal();
        startProcessing();
    }, 3000);
}

// بدء المعالجة
function startProcessing() {
    // إخفاء قسم الرفع وإظهار قسم المعالجة
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('processing-section').style.display = 'block';
    
    // التمرير إلى قسم المعالجة
    document.getElementById('processing-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // محاكاة التقدم
    simulateProgress();
}

// محاكاة التقدم
function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const statusText = document.getElementById('processingStatus');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        // تحديث حالة المعالجة
        if (progress > 30 && progress <= 60) {
            statusText.textContent = 'تحليل الصور...';
        } else if (progress > 60 && progress <= 90) {
            statusText.textContent = 'الذكاء الاصطناعي يقوم بدمج الصور...';
        } else if (progress > 90) {
            statusText.textContent = 'وضع اللمسات الأخيرة...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            statusText.textContent = 'تم الانتهاء!';
            
            setTimeout(() => {
                showResult();
            }, 1500);
        }
    }, 300);
}

// إظهار النتيجة
function showResult() {
    // إخفاء قسم المعالجة وإظهار قسم النتيجة
    document.getElementById('processing-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    // إنشاء صورة نتيجة وهمية (في التطبيق الحقيقي ستكون من الخادم)
    const resultImage = document.getElementById('resultImage');
    const demoResultImage = createDemoResult();
    resultImage.innerHTML = demoResultImage;
    
    // التمرير إلى قسم النتيجة
    document.getElementById('result-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showToast('success', 'تم بنجاح!', 'تم دمج الصور بنجاح');
}

// إنشاء نتيجة تجريبية
function createDemoResult() {
    return `
        <div class="polaroid-frame floating-animation">
            <div style="width: 300px; height: 300px; background: linear-gradient(45deg, #ff9a56, #ff6b6b); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; text-align: center; flex-direction: column;">
                <i class="fas fa-magic" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <div>صورة مدموجة بـ AI</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">نموذج تجريبي</div>
            </div>
            <div class="polaroid-caption">AI Generated Polaroid ✨</div>
        </div>
    `;
}

// تحميل النتيجة
function downloadResult() {
    showToast('info', 'ميزة التحميل', 'في النسخة الكاملة، ستتمكن من تحميل الصورة بجودة عالية');
}

// مشاركة النتيجة
function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: 'صورة مدموجة بالذكاء الاصطناعي',
            text: 'شاهد هذه الصورة المميزة التي تم دمجها بالذكاء الاصطناعي!',
            url: window.location.href
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('success', 'تم النسخ', 'تم نسخ رابط الموقع إلى الحافظة');
    } else {
        showToast('info', 'مشاركة', 'انسخ الرابط من شريط العنوان لمشاركته');
    }
}

// دمج جديد
function newMerge() {
    // إعادة تعيين المتغيرات
    firstImageFile = null;
    secondImageFile = null;
    resultImageData = null;
    
    // مسح النماذج
    document.getElementById('firstImage').value = '';
    document.getElementById('secondImage').value = '';
    document.getElementById('firstPreview').style.display = 'none';
    document.getElementById('secondPreview').style.display = 'none';
    document.getElementById('firstPreview').innerHTML = '';
    document.getElementById('secondPreview').innerHTML = '';
    
    // إعادة تعيين شريط التقدم
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
    document.getElementById('processingStatus').textContent = 'جاري المعالجة...';
    
    // إخفاء الأقسام وإظهار قسم الرفع
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('processing-section').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    
    // التمرير إلى قسم الرفع
    scrollToUpload();
    
    // تحديث حالة الزر
    checkButtonState();
    
    showToast('info', 'جاهز', 'يمكنك الآن رفع صور جديدة');
}

// نظام التنبيهات
function setupToastSystem() {
    // التنبيهات ستتم إدارتها من خلال showToast
}

function showToast(type, title, description) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    container.appendChild(toast);
    
    // إزالة التنبيه بعد 5 ثوان
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// إدارة النوافذ المنبثقة
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// تفاعلات إضافية
document.addEventListener('keydown', function(e) {
    // إغلاق النافذة بمفتاح Escape
    if (e.key === 'Escape') {
        closeModal();
    }
});

// تحسين الأداء - lazy loading للصور
function observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// تفعيل lazy loading عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', observeImages);

console.log('🎨 موقع دمج الصور بالذكاء الاصطناعي');
console.log('المطور: علي لطيف | https://tranks.infinityfreeapp.com/');
console.log('للحصول على النسخة الكاملة مع API حقيقي، تواصل مع المطور');
