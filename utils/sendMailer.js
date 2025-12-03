const nodemailer = require("nodemailer");

async function sendOrderEmail(to, order) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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

  const message = `
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

  await transporter.sendMail({
    from: `"FlipShop" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmation - ${order._id}`,
    html: message,
  });

  console.log("Order email sent successfully!");
}

module.exports = sendOrderEmail;
