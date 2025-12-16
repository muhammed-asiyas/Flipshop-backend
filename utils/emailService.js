const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOrderEmail(to, order) {
  const itemsHtml = order.items
    .map(
      (item) => {
        const itemTotal = item.price * item.qty;
        return `
          <tr>
            <td>${item.name}</td>
            <td>${item.size || "-"}</td>
            <td>${item.qty}</td>
            <td>₹${item.price}</td>
            <td>₹${itemTotal}</td>
          </tr>
        `;
      }
    )
    .join("");

  const html = `
    <h2>Your Order is Confirmed</h2>
    <p>Thank you for shopping with us!</p>

    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Item</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="4" align="right"><strong>Grand Total</strong></td>
          <td><strong>₹${order.totalPrice}</strong></td>
        </tr>
      </tbody>
    </table>

    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
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

module.exports = { sendOrderEmail };
