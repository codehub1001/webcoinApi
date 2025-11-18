const nodemailer = require("nodemailer");
require("dotenv").config();

async function test() {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.DEST_EMAIL,
      subject: "Test Email",
      text: "This is a test email from Nodemailer",
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
