// Simple backend for vendor email testing
// To run: npm install express cors body-parser && node sendVendorEmail.cjs

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Replace these with your Mailtrap SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: '2b9a756b263c8d', // <-- Replace with your Mailtrap user
    pass: '9831a60693e1b8'  // <-- Replace with your Mailtrap password
  }
});

app.post('/send-vendor-email', async (req, res) => {
  const { email, username, password, type } = req.body;
  console.log('Received request to send email to:', email, 'type:', type);

  let subject = '';
  let html = '';

  if (type === 'initial') {
    subject = 'Vendor Account Approved - Set Your Password';
    html = `<p>Your vendor account has been approved!<br/>
      <b>Username:</b> ${username}<br/>
      <b>Password:</b> ${password}<br/>
      Please login and set your new password to continue.</p>`;
  } else if (type === 'final') {
    subject = 'Vendor Account Activated!';
    html = `<p>Your vendor account is now <b>active</b>!<br/>
      <b>Username:</b> ${username}<br/>
      Your account has been successfully created for your business. You can now login and start using your dashboard.</p>`;
  } else {
    res.status(400).json({ error: 'Invalid email type' });
    return;
  }

  try {
    let info = await transporter.sendMail({
      from: 'ramasarma.pakala@gmail.com',
      to: email,
      subject,
      html
    });

    console.log('Message sent: %s', info.messageId);
    res.json({ success: true, message: 'Email sent successfully', info });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Vendor email backend running on http://localhost:${PORT}`);
}); 

