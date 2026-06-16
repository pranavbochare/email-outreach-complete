import { config } from "../../config/index.js";

export async function generateEmail(contact, description) {
  const { firstName, name, title, company, industry } = contact;

  const subject = await subjects(company, industry, description);
  const body = await buildBody(firstName, title, company, industry, description);

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

async function buildBody(firstName, title, company, industry, description) {
  const { apiKey, model } = config.qwen;

  const prompt = `
Generate a professional and personalized outreach email body.

Company: ${company || "Unknown Company"}
Industry: ${industry || "Unknown Industry"}
Recipient Name: ${firstName || ""}
Recipient Title: ${title || ""}
User's Outreach Purpose / Description:
${description || ""}

Instructions:
- The email must be based primarily on the user's description and outreach objective.
- Personalize the opening using the recipient's name and title when available.
- Reference the company naturally where relevant.
- Clearly communicate the value proposition, proposal, request, opportunity, or purpose described by the user.
- Keep the tone professional, concise, and human.
- Avoid generic sales language and unnecessary fluff.
- Do not invent facts about the company.
- If some information is missing, create the best possible email using the available details.
- Include a natural greeting and closing.
- Do NOT include placeholders such as [Your Name], [Company Name], or similar.
- Do NOT generate an email subject.
- Return ONLY the email body text with proper paragraph formatting.
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
