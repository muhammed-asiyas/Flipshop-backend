const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS via 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send order email using Nodemailer + SendGrid SMTP
 */
async function sendOrderEmail(to, order) {
  const itemsHtml = order.items
    .map(
      (item) => `
<tr>
  <td>${item.name}</td>
  <td>${item.size || "-"}</td>
  <td>${item.qty}</td>
  <td>₹${item.price}</td>
</tr>`
    )
    .join("");

  const html = `
<h2>Thank you for your order!</h2>
<p>Your order <strong>${order._id}</strong> has been placed successfully.</p>

<h3>Order Details</h3>
<p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

<h3>Items:</h3>
<table border="1" cellpadding="8" style="border-collapse: collapse;">
<tr>
  <th>Name</th>
  <th>Size</th>
  <th>Qty</th>
  <th>Price</th>
</tr>
${itemsHtml}
</table>

<h3>Total Amount: ₹${order.totalPrice}</h3>

<p>We appreciate your purchase!</p>
`;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: "asiyasmuhammed18@gmail.com",
    subject: `Order Confirmation - ${order._id}`,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOrderEmail };
