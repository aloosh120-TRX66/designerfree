import express from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';
import cors from 'cors';
import fs from 'fs';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('.'));

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/merge', upload.array('images', 2), async (req, res) => {
  try {
    const [img1, img2] = req.files;
    const imageFile = fs.createReadStream(img1.path);
    const maskFile = fs.createReadStream(img2.path);

    const response = await openai.images.edit({
      image: imageFile,
      mask: maskFile,
      prompt: "A polaroid photo of two people standing close togther. The photo should looK like an ordinary photograph with no clear subject Tne lighting should resemble a flash froma dark room sdr ead evely througt. the photo. keep the faces as they ary Replace the background behind them with a simple white curtain",
      n: 1,
      size: '512x512',
    });

    res.json({ url: response.data[0].url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل الدمج' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
