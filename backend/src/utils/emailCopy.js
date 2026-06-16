import { config } from "../../config/index.js";

export async function generateEmail(contact, description) {
  const { firstName, name, title, company, industry } = contact;

  const subject = await subjects(company, industry, description);
  const body = await buildBody(firstName, title, company, industry, description);

  return { subject, body };
}

async function subjects(company, industry, description) {
  const { apiKey, model } = config.qwen;

  const prompt = `build a email subject in short and crisp manner for the following company: ${company} in ${industry} industry with the following description: ${description} if anything is missing then still generate the subject based on the available things. Please provide only the subject line without any additional text.`;

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

  const prompt = `build a email body for the following company: ${company} in ${industry} industry with the following description: ${description}. and also add ${firstName} (${title}) to the email.do not include this [your name] in the email body just give text and also do not add subject in this. Please provide only the body content without any additional text.`;

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
