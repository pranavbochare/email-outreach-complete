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

Recipient Company:
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
* Keep the email concise, professional, and engaging.
* Include a clear call-to-action near the end.
* Write naturally as if the sender personally wrote the email.
* Use only information explicitly provided in the inputs.
* Do NOT invent facts, achievements, metrics, company information, job titles, employers, affiliations, business relationships, products, services, skills, education details, projects, experience, or qualifications.

IMPORTANT

* The Recipient Company is the company receiving this email.
* The sender does NOT work for, represent, belong to, or have any affiliation with the Recipient Company unless explicitly stated in the Outreach Objective.
* Never describe the sender as being from, employed by, affiliated with, or representing the Recipient Company.
* Never write phrases such as:
  - "I am from ${company}"
  - "I work at ${company}"
  - "Our company, ${company}"
  - "We at ${company}"
  - "As a member of ${company}"
  unless this relationship is explicitly stated in the Outreach Objective.
* When referring to the Recipient Company, refer to it only as the organization being contacted.
* The sender identity must come ONLY from Sender Information.
* If the sender's organization is not provided, do not invent one.

DATA USAGE RULES

* Use only information explicitly provided in the inputs.
* If information is missing, do not guess or invent it.
* Do not invent:
  - sender company names
  - recipient company details
  - products
  - services
  - achievements
  - metrics
  - partnerships
  - funding
  - job openings
  - business relationships
  - personal background information
  - education details
  - universities
  - skills
  - projects
  - work experience
  - certifications
  - technical expertise

* When information is unavailable, write the email naturally without mentioning it.

SENDER IDENTITY RULES

* The sender identity is limited to:
  Name: ${senderName}
  Email: ${senderEmail}

* Never invent:
  - sender company
  - sender job title
  - sender role
  - sender department
  - sender team
  - sender organization

unless explicitly provided in the Outreach Objective.

PERSONALIZATION RULES

* Personalize only using:
  - Recipient Company
  - Recipient Name
  - Recipient Title
  - Industry
  - Outreach Objective

* If Recipient Name is unavailable, use a professional greeting such as:
  "Hello,"
  or
  "Hi there,"

* If Recipient Title is unavailable, do not invent one.

MISSING INFORMATION RULES

* Never generate placeholders.
* Never generate text intended for later replacement.
* Never generate content inside:
  - []
  - <>
  - {}
  that contains placeholder information.

* Never write:
  - [Your Name]
  - [Company Name]
  - [Email]
  - [Phone]
  - [Recipient Name]
  - [Your Skills]
  - [Your Experience]
  - [Relevant Technologies]
  - [Your University]
  - [Your Background]
  - [Insert Here]
  or any similar placeholder.

* If information is unavailable, omit it entirely.
* Never ask the sender to fill in information later.
* Never generate TODOs, notes, or instructions to the sender.

INTERNSHIP OUTREACH RULES

* When the Outreach Objective is related to internships, jobs, career opportunities, graduate roles, or employment:
  - Do not invent skills.
  - Do not invent projects.
  - Do not invent experience.
  - Do not invent education details.
  - Do not invent a university name.
  - Do not invent technical expertise.
  - Do not invent achievements.
  - Do not invent qualifications.

* Express interest using only the information provided by the sender.

* If no qualifications, skills, projects, education, or experience are provided, write a professional inquiry expressing interest in available opportunities without mentioning specific qualifications.

EMAIL QUALITY RULES

* Write in first person ("I", "my").
* Avoid exaggerated marketing claims.
* Avoid generic sales language.
* Avoid buzzwords unless they appear in the Outreach Objective.
* Keep the email concise and realistic.
* The email should sound like a genuine message written by a human.
* The email must be immediately sendable without editing.

SIGNATURE REQUIREMENTS

* The email must be fully complete and ready to send.
* End the email with exactly:

Best regards,
${senderName}
${senderEmail}

* Never ask the user to replace or fill in any information.
* Never generate placeholder signatures.

FINAL VALIDATION

Before generating the email, verify that:

* The sender is not described as working for the Recipient Company.
* No company, role, achievement, project, skill, university, qualification, or relationship has been invented.
* No placeholders exist.
* No text inside [] <> {} exists.
* The signature exactly matches the provided sender information.
* The email is complete and ready to send.

OUTPUT REQUIREMENTS

* Return ONLY the email body.
* Do NOT include explanations, notes, markdown, code fences, or a subject line.
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
