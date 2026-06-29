// Resend email notification — owner alert + customer confirmation
// Environment variable: RESEND_API_KEY (set in Vercel dashboard, never hardcoded)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { full_name, phone, email, lesson_type, message } = body || {};

  if (!full_name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const OWNER_EMAIL = 'info@right2drive.com.au';
  const FROM_ADDRESS = 'Right 2 Drive <noreply@right2drive.com.au>';

  async function sendEmail(to, subject, html) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Resend error ${r.status}: ${err}`);
    }
    return r.json();
  }

  // Owner notification
  const ownerHtml = `
<!DOCTYPE html>
<html><body style="font-family:Inter,sans-serif;color:#0F1B2A;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#1E3A5F;border-radius:12px;padding:24px 28px;margin-bottom:24px">
    <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em">Right 2 Drive</div>
    <div style="font-size:13px;color:#93A8C2;margin-top:4px">New Booking Enquiry</div>
  </div>
  <div style="background:#F4F7FB;border-radius:12px;padding:24px 28px;margin-bottom:20px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#6B7585;font-size:13px;width:130px">Full Name</td><td style="padding:8px 0;font-weight:600;font-size:15px">${escHtml(full_name)}</td></tr>
      <tr><td style="padding:8px 0;color:#6B7585;font-size:13px">Phone</td><td style="padding:8px 0;font-weight:600"><a href="tel:${escHtml(phone)}" style="color:#2563EB">${escHtml(phone)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B7585;font-size:13px">Email</td><td style="padding:8px 0;font-weight:600"><a href="mailto:${escHtml(email)}" style="color:#2563EB">${escHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B7585;font-size:13px">Lesson Type</td><td style="padding:8px 0"><span style="background:#EFF5FF;color:#2563EB;padding:4px 12px;border-radius:100px;font-size:13px;font-weight:600">${escHtml(lesson_type || '—')}</span></td></tr>
      ${message ? `<tr><td style="padding:8px 0;color:#6B7585;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px;line-height:1.6">${escHtml(message)}</td></tr>` : ''}
    </table>
  </div>
  <a href="mailto:${escHtml(email)}" style="display:inline-block;background:#2563EB;color:#fff;padding:13px 24px;border-radius:9px;font-weight:700;font-size:15px;text-decoration:none">Reply to ${escHtml(full_name)}</a>
  <p style="color:#6B7585;font-size:12px;margin-top:24px">This enquiry was submitted via the Right 2 Drive website.</p>
</body></html>`;

  // Customer confirmation
  const customerHtml = `
<!DOCTYPE html>
<html><body style="font-family:Inter,sans-serif;color:#0F1B2A;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#1E3A5F;border-radius:12px;padding:24px 28px;margin-bottom:24px">
    <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em">Right 2 Drive</div>
    <div style="font-size:13px;color:#93A8C2;margin-top:4px">Driving School · Minto NSW</div>
  </div>
  <h2 style="font-size:22px;font-weight:800;margin-bottom:10px">Thanks, ${escHtml(full_name.split(' ')[0])}! 👋</h2>
  <p style="font-size:16px;color:#475467;line-height:1.7;margin-bottom:20px">We've received your enquiry and will be in touch <strong>the same day</strong> to lock in your lesson time.</p>
  <div style="background:#F4F7FB;border-radius:12px;padding:20px 24px;margin-bottom:24px">
    <div style="font-size:13px;font-weight:600;color:#6B7585;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">Your Enquiry</div>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#6B7585;font-size:13px;width:130px">Lesson Type</td><td style="padding:6px 0;font-weight:600;font-size:14px">${escHtml(lesson_type || '—')}</td></tr>
      ${message ? `<tr><td style="padding:6px 0;color:#6B7585;font-size:13px;vertical-align:top">Message</td><td style="padding:6px 0;font-size:14px;line-height:1.6">${escHtml(message)}</td></tr>` : ''}
    </table>
  </div>
  <div style="background:#EFF5FF;border-radius:12px;padding:20px 24px;margin-bottom:24px">
    <div style="font-weight:700;font-size:15px;margin-bottom:12px;color:#1E3A5F">Contact us directly</div>
    <div style="font-size:14px;color:#475467;line-height:2">
      📞 <a href="tel:+61212345678" style="color:#2563EB;font-weight:600">(02) 1234 5678</a><br>
      ✉️ <a href="mailto:info@right2drive.com.au" style="color:#2563EB;font-weight:600">info@right2drive.com.au</a><br>
      📍 Minto NSW 2566, Australia<br>
      🕐 Mon–Sun · 6:00am – 8:00pm
    </div>
  </div>
  <p style="color:#6B7585;font-size:13px;line-height:1.6">We look forward to helping you get your licence. See you on the road! 🚗</p>
  <p style="color:#6B7585;font-size:13px;margin-top:8px"><strong>Right 2 Drive Driving School</strong><br>Minto NSW 2566</p>
</body></html>`;

  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  try {
    await Promise.all([
      sendEmail(OWNER_EMAIL, `New enquiry from ${full_name} — ${lesson_type || 'Driving Lesson'}`, ownerHtml),
      sendEmail(email, 'We received your enquiry — Right 2 Drive', customerHtml),
    ]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('notify.js error:', err);
    // Don't expose internal error detail to client
    return res.status(500).json({ error: 'Email send failed' });
  }
}
