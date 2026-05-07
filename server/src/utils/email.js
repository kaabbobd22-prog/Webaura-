import nodemailer from 'nodemailer';

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendOrderEmail(order) {
  const transporter = getTransporter();
  if (!transporter) return false;

  const lines = order.items
    .map((item) => `- ${item.product?.title || item.title}: ${item.product?.fileUrl || 'File URL not configured yet'}`)
    .join('<br/>');

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: order.buyerEmail,
    subject: `Your website order ${order._id}`,
    html: `
      <h2>Thanks for your purchase, ${order.buyerName}</h2>
      <p>Your order is confirmed. Here are your download links:</p>
      <p>${lines}</p>
      <p>If you need help, reply to this email.</p>
    `
  });

  return true;
}

export async function sendCustomRequestAlert(request) {
  const transporter = getTransporter();
  if (!transporter || !process.env.ADMIN_EMAIL) return false;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New custom website request from ${request.name}`,
    html: `
      <h2>New custom request</h2>
      <p><strong>Name:</strong> ${request.name}</p>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Type:</strong> ${request.type}</p>
      <p><strong>Budget:</strong> ${request.budget}</p>
      <p><strong>Timeline:</strong> ${request.timeline}</p>
      <p><strong>Description:</strong><br/>${request.description}</p>
    `
  });

  return true;
}
