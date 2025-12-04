const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // App password
  },
});

async function sendOrderEmail(to, order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.size || "-"}</td>
        <td>${item.qty}</td>
        <td>₹${item.price}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <h2>Your Order is Confirmed</h2>
    <p>Thank you for shopping with us!</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr>
        <th>Item</th><th>Size</th><th>Qty</th><th>Price</th>
      </tr>
      ${itemsHtml}
    </table>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Order Confirmation",
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Gmail Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}

module.exports = sendOrderEmail;
