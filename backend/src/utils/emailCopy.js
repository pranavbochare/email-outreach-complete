import { config } from "../../config/index.js";

export async function generateEmail(contact, senderName, senderEmail, description) {
  const { firstName, name, title, company, industry } = contact;

  const subject = await subjects(company, industry, description);
  const body = await buildBody(
    firstName,
    title,
    company,
    industry,
    senderName,
    senderEmail,
    description,
  );

  return { subject, body };
}

async function subjects(company, industry, description) {
  const { apiKey, model } = config.qwen;

  const prompt = `
Generate a professional, short, and personalized email subject line based primarily on the user's outreach description.

Company: ${company || "Unknown"}
Industry: ${industry || "Unknown"}
User Description: ${description || ""}

Instructions:
- The subject must accurately reflect the user's description and intent.
- Use the company name and industry only as supporting context.
- If the description contains a value proposition, partnership idea, service offering, hiring interest, sales pitch, or collaboration request, make that the focus of the subject.
- Keep it concise (4-10 words preferred).
- Make it sound natural and professional.
- Do not use clickbait, excessive punctuation, or generic subjects.
- If the description is missing or too short, generate the best subject possible using the available company and industry information.
- Return ONLY the subject line.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const subject = data?.choices?.[0]?.message?.content?.trim();

  return subject;
}

async function buildBody(
  firstName,
  title,
  company,
  industry,
  senderName,
  senderEmail,
  description,
) {
  const { apiKey, model } = config.qwen;

  const prompt = `
Generate a complete, ready-to-send outreach email.

INPUTS
Company:
${company || "Unknown Company"}

Industry:
${industry || "Unknown Industry"}

Recipient Information:
Name: ${firstName || ""}
Title: ${title || ""}

Sender Information:
Name: ${senderName || ""}
Email: ${senderEmail || ""}

Outreach Objective:
${description || ""}

INSTRUCTIONS

* Write a personalized outreach email based primarily on the Outreach Objective.
* The email should feel human, professional, and written specifically for the recipient.
* Do NOT generate a subject line in the email body.
* Personalize the opening using the recipient's name and title when available.
* Clearly explain why the sender is reaching out.
* Focus on the value, opportunity, collaboration, proposal, internship request, partnership, product, or service described in the Outreach Objective.
* Do NOT invent facts, achievements, metrics, or company information.
* Keep the email concise, professional, and engaging.
* Include a clear call-to-action near the end.
* Write naturally as if the sender personally wrote the email.
* Never use placeholders such as:
  [Your Name]
  [Company Name]
  [Email]
  [Phone]
  [Recipient Name]

SIGNATURE REQUIREMENTS

* The email must be fully complete and ready to send.
* End the email with exactly:

Best regards,
${senderName}
${senderEmail}

* Never ask the user to replace or fill in any information in [].
* Never generate placeholder signatures.

OUTPUT REQUIREMENTS

* Return ONLY the email body.
* Do NOT include explanations, notes, markdown, or code fences.
* The output should be a complete email that can be sent immediately without any edits.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const emailBody = data?.choices?.[0]?.message?.content?.trim();

  return emailBody;
}

function article(word = "") {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}
