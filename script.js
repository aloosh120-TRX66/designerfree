document.addEventListener('DOMContentLoaded', () => {
    const image1Input = document.getElementById('image1');
    const image2Input = document.getElementById('image2');
    const mergeBtn = document.getElementById('mergeBtn');
    const loadingDiv = document.getElementById('loading');
    const resultArea = document.getElementById('result-area');
    const resultImage = document.getElementById('resultImage');
    const downloadLink = document.getElementById('downloadLink');

    mergeBtn.addEventListener('click', async () => {
        const image1 = image1Input.files[0];
        const image2 = image2Input.files[0];

        if (!image1 || !image2) {
            alert('الرجاء اختيار صورتين لدمجهما.');
            return;
        }

        loadingDiv.classList.remove('hidden');
        resultArea.classList.add('hidden');
        mergeBtn.disabled = true;

        const formData = new FormData();
        formData.append('image1', image1);
        formData.append('image2', image2);

        try {
            // هنا يرسل الطلب إلى الخادم
            const response = await fetch('/merge', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى.');
            }

            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
                return;
            }

            resultImage.src = data.imageUrl;
            downloadLink.href = data.imageUrl;
            resultArea.classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ أثناء الدمج. الرجاء التحقق من الاتصال والمحاولة مرة أخرى.');
        } finally {
            loadingDiv.classList.add('hidden');
            mergeBtn.disabled = false;
        }
    });
});
