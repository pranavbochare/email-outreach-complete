import express from "express";
import cors from "cors";

import { generateCampaign } from "./services/pipeline.js";
import { sendCampaign } from "./services/sendCampaign.js";

const app = express();

app.use(cors());

app.use(express.json());

app.post("/generate-campaign", async (req, res) => {
  try {
    const { domain, description } = req.body;

    console.log(`Generating campaign for domain: ${domain}`);
    console.log(`Description: ${description}`);

    const emails = await generateCampaign(domain, description);

    res.json(emails);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/send-campaign", async (req, res) => {
  try {
    const { emails } = req.body;

    const results = await sendCampaign(emails);

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
