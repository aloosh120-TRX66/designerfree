const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs');

// ضع مفتاحك هنا مباشرةً
const OPENAI_API_KEY = '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'; 

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// تقديم ملفات الواجهة الأمامية
app.use(express.static(path.join(__dirname)));

app.post('/merge', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
    const { image1, image2 } = req.files;

    if (!image1 || !image2) {
        return res.status(400).json({ error: 'الرجاء تحميل كلتا الصورتين.' });
    }

    try {
        // النمط المخصص لدمج الصور
        const prompt = "A polaroid photo of two people standing close together. The photo should look like an ordinary photograph with no clear subject. The lighting should resemble a flash from a dark room spread evenly throughout the photo. keep the faces as they are. Replace the background behind them with a simple white curtain";
        
        const response = await openai.images.generate({
            model: "dall-e-3", 
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });

        const imageUrl = response.data[0].url;

        // حذف الملفات المؤقتة بعد الاستخدام
        fs.unlinkSync(image1[0].path);
        fs.unlinkSync(image2[0].path);

        res.json({ imageUrl });

    } catch (error) {
        console.error("Error generating image:", error.response?.data || error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء دمج الصور مع OpenAI.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
