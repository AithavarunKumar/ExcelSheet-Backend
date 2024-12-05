const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const xlsx = require('xlsx');
const Record = require('./models/Record');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ExcelData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

const upload = multer({ dest: 'uploads/' });

// Upload Excel file and save data to MongoDB
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const jsonData = req.file
      ? xlsx.utils.sheet_to_json(xlsx.readFile(req.file.path).Sheets[req.file.path.split('/').pop()])
      : JSON.parse(req.body.file);

    const records = await Record.insertMany(jsonData);
    res.status(200).json({ message: 'Data inserted', records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve records from MongoDB
app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  // Check if required fields are provided
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user:'aithavarunkumar01@gmail.com', // Make sure this is correct
        pass: 'elrl ptcr qxdo vsed', // Make sure this is correct
      },
      debug: true,
    });

    const mailOptions = {
      from: 'aithavarunkumar01@gmail.com',
      to: email,
      subject: subject,
      html: message,
    };

    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in /send-email:', error); // Log the error
    res.status(500).json({ error: error.message });
    // console.log(mailOptions)
  }
});
// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

