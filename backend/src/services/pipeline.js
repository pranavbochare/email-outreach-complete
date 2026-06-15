import { findLookalikes } from "../stages/01-ocean.js";
import { findDecisionMakers } from "../stages/02-prospeo.js";
import { generateEmail } from "../utils/emailCopy.js";

export async function generateCampaign(domain, description) {
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

  const emailSubjectAndBody = await generateEmail(contacts[0], description);

  const emails = contacts.map((contact) => ({
    ...contact,

    subject: emailSubjectAndBody.subject,

    body: emailSubjectAndBody.body,
  }));

  return emails;
}
