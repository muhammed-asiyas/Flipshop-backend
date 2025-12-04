const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendOrderEmail = async (to, order) => {
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
    <h2>Your Order is Confirmed!</h2>
    <p>Thank you for shopping with us.</p>

    <h3>Order Details</h3>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr>
        <th>Product</th>
        <th>Size</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>
      ${itemsHtml}
    </table>

    <p><strong>Total: ₹${order.totalPrice}</strong></p>
  `;

  const msg = {
    to,
    from: process.env.FROM_EMAIL, // must be VERIFIED
    subject: "Your Order Confirmation",
    html,
  };

  return sgMail.send(msg);
};
