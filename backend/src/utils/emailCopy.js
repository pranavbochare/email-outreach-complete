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
You are an expert B2B outreach copywriter.

Your task is to write a highly personalized cold outreach email.

INPUTS

Company: ${company || "Unknown Company"}
Industry: ${industry || "Unknown Industry"}

Recipient:
Name: ${firstName || ""}
Title: ${title || ""}

Sender:
Name: ${senderName || ""}
Email: ${senderEmail || ""}

User's Offering / Goal:
${description || ""}

EMAIL REQUIREMENTS

1. Base the email primarily on the user's offering, goal, and value proposition.
2. Personalize the opening using the recipient's name and role whenever available.
3. Mention the company naturally if relevant, but do not invent facts about the company.
4. Explain clearly why the sender is reaching out and how the recipient could benefit.
5. Focus on business value and outcomes rather than product features.
6. Use a professional, conversational, and human tone.
7. Keep the email concise (120-200 words).
8. Avoid buzzwords, hype, exaggerated claims, and generic sales language.
9. Avoid phrases such as:

   * "I hope you're doing well"
   * "I came across your profile"
   * "Reaching out to see if"
   * "Synergy"
   * "Game-changing"
   * "Revolutionary"
10. End with a simple and natural call-to-action.
11. Include a professional sign-off using the sender's name.
12. Do not include the sender's email unless naturally needed in the signature.
13. Do not generate a subject line.
14. Do not use placeholders such as [Your Name], [Company Name], etc.
15. If recipient information is unavailable, write a professional email without forcing personalization.

OUTPUT FORMAT

Return ONLY the email body text.

Structure:
Greeting

Opening personalized sentence

Value proposition / reason for reaching out

Brief explanation of potential benefit

Call to action

Closing with sender name and email.
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
