// Simple Express backend for API testing with Postman
// To run: npm install express && node test-backend.cjs

const express = require('express');
const { Resend } = require('resend');
const resend = new Resend('YOUR_RESEND_API_KEY'); // Replace with your actual API key
const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware to parse JSON bodies
app.listen(PORT, () => {
  console.log(`Test backend running on http://localhost:${PORT}`);
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

app.post('/api/test', (req, res) => {
    const { email, link } = req.body;
    console.log('Received request to send email to:', email, 'with link:', link);
  res.json({ success: true, received: req.body });
});

app.post('/send-vendor-email', async (req, res) => {
  const { email, link } = req.body;
  console.log('Received request to send email to:', email, 'with link:', link);

  try {
    const { data, error } = await resend.emails.send({
      from: 'your_verified_sender@email.com', // Use your verified sender email
      to: email,
      subject: 'Vendor Details Link',
      html: `<p>Click the following link to view your vendor details: <a href="${link}">${link}</a></p>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: 'Email sent successfully', data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

 