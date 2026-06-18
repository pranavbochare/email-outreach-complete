import { findLookalikes } from "../stages/01-ocean.js";
import { findDecisionMakers } from "../stages/02-prospeo.js";
import { generateEmail } from "../utils/emailCopy.js";

export async function generateCampaign(senderName, senderEmail, domain, description) {
  // Stage 1
  const companies = await findLookalikes(domain);

  if (!companies.length) {
    throw new Error("No lookalike companies found");
  }

  // Stage 2
  const contacts = await findDecisionMakers(companies);

  if (!contacts.length) {
    throw new Error("No decision makers found");
  }

  // Generate personalized email for every contact
  const emails = await Promise.all(
    contacts.map(async (contact) => {
      const emailSubjectAndBody = await generateEmail(contact, senderName, senderEmail, description);

      return {
        ...contact,
        subject: emailSubjectAndBody.subject,
        body: emailSubjectAndBody.body,
      };
    }),
  );

  return emails;
}
