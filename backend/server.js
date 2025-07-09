// Simple backend for vendor email testing
// To run: npm install express cors body-parser @supabase/supabase-js nodemailer && node sendVendorEmail.cjs

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase setup
const supabase = createClient(
  'https://oqqqlvxgjwkboqbrctbr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcXFsdnhnandrYm9xYnJjdGJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ2ODcwNiwiZXhwIjoyMDY3MDQ0NzA2fQ.yizG5LlNuVhEjrhuoIsarsaXK2mR-wnrFgQGOneaoyQ'
);

// Nodemailer setup (Mailtrap example)
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: '991489aad46bb4', // <-- Replace with your Mailtrap user
    pass: '2e7324a701b047'  // <-- Replace with your Mailtrap password
  }
});

// Email sending function
async function sendVendorEmail({ email, username, password, type }) {
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
    throw new Error('Invalid email type');
  }

  let info = await transporter.sendMail({
    from: 'devasarma575@outlook.com',
    to: email,
    subject,
    html
  });

  return info;
}

// API 1: Register Vendor
app.post('/registerVendor', async (req, res) => {
  const { name, email, mobile } = req.body;
  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Insert into vendors table (no password)
  const { error } = await supabase
    .from('vendors')
    .insert({ name, email, phone:mobile });
  if (error) {
    return res.status(400).json({ error: 'Failed to insert vendor: ' + error.message });
  }

  return res.status(200).json({ message: 'Vendor registered', email });
});

// API 2: Send Vendor Email (standalone)
app.post('/send-vendor-email', async (req, res) => {
  const { email, username, password, type } = req.body;
  try {
    const info = await sendVendorEmail({ email, username, password, type });
    res.json({ success: true, message: 'Email sent successfully', info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Supabase admin API error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ users: data.users });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 

