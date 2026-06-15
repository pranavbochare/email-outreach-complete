import { sendOutreach } from "../stages/04-brevo.js";

export async function sendCampaign(emails) {
  return await sendOutreach(emails);
}
