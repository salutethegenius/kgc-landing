import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENTS = {
  default: [process.env.NOTIFY_EMAIL || 'frontdesk@kemisdigital.com'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot: if filled, treat as spam
  if (body.website) {
    return res.status(200).json({ success: true });
  }

  const isCareers = !!body.role;

  try {
    let html, subject, to, replyTo, fromEmail;

    if (isCareers) {
      const required = ['role', 'name', 'email', 'location', 'availability', 'right_to_work', 'work_example', 'mission_answer'];
      const missing = required.filter((key) => !body[key]);
      if (missing.length > 0) {
        return res.status(400).json({ error: 'Missing required fields: ' + missing.join(', ') });
      }

      subject = `KGC Careers Application: ${body.role}`;
      to = RECIPIENTS.default;
      replyTo = body.email;
      html = `
        <h2>Careers Application</h2>
        <p><strong>Role:</strong> ${escapeHtml(body.role)}</p>
        <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>Location:</strong> ${escapeHtml(body.location)}</p>
        <p><strong>Availability:</strong> ${escapeHtml(body.availability)}</p>
        <p><strong>Right to work in The Bahamas:</strong> ${escapeHtml(body.right_to_work)}</p>
        <p><strong>Portfolio / Résumé:</strong> ${escapeHtml(body.portfolio || 'Not provided')}</p>
        <p><strong>Compensation expectations:</strong> ${escapeHtml(body.compensation || 'Not provided')}</p>
        <h3>Relevant work example</h3>
        <p>${escapeHtml(body.work_example)}</p>
        <h3>Why this mission?</h3>
        <p>${escapeHtml(body.mission_answer)}</p>
      `;
    } else {
      const required = ['name', 'email', 'reason', 'message'];
      const missing = required.filter((key) => !body[key]);
      if (missing.length > 0) {
        return res.status(400).json({ error: 'Missing required fields: ' + missing.join(', ') });
      }

      subject = `KGC inquiry: ${body.reason}`;
      to = RECIPIENTS.default;
      replyTo = body.email;
      html = `
        <h2>Contact Form Submission</h2>
        <p><strong>Reason:</strong> ${escapeHtml(body.reason)}</p>
        <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>Organization:</strong> ${escapeHtml(body.organization || 'Not provided')}</p>
        <h3>Message</h3>
        <p>${escapeHtml(body.message)}</p>
      `;
    }

    fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@thekemisgroup.com';

    const data = await resend.emails.send({
      from: `Kemis Group <${fromEmail}>`,
      to,
      replyTo,
      subject,
      html,
    });

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
