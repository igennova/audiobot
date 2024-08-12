import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: ["https://audiobot-5box.vercel.app", "https://audiobot-three.vercel.app/"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to convert file to generative part
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No ile uploaded.');
    }
    // Respond with the file path or URL
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Eror');
  }
});

app.post('/process', async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).send('No file URL provided.');
    }

   
    const filePath = path.join(__dirname, 'uploads', fileUrl.replace('/uploads/', ''));

    const audioPart = fileToGenerativePart(filePath, 'audio/mp3');
    
  
    const prompt = "just give the english text of hindi audio";

    const result = await model.generateContent([prompt, audioPart]);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('File deleted successfully');
    });
    
    // Send the summary response
    res.json({ summary: result.response.text() });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.get("/",console.log("HELLo"))
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
