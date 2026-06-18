import { sendOutreach } from "../stages/04-brevo.js";

export async function sendCampaign(emails, senderName, senderEmail) {
  return await sendOutreach(emails, senderName, senderEmail);
}
