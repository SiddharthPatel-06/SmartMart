exports.generateInvoiceHTML = (invoice, martInfo) => {
  return `
    <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;border:1px solid #ccc;">
      ${martInfo.logoUrl ? `<div style="text-align:center;margin-bottom:10px;">
        <img src="${martInfo.logoUrl}" alt="${martInfo.name} Logo" style="max-height: 80px;" />
      </div>` : ""}
      <h2 style="text-align:center;color:#4CAF50;">${martInfo.name}</h2>
      <p style="text-align:center;margin:0;">${martInfo.address}</p>
      <p style="text-align:center;margin:0;">Contact: ${martInfo.contact}</p>
      <hr/>
      <h3>Invoice</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ddd;padding:8px;">Item</th>
            <th style="border:1px solid #ddd;padding:8px;">Qty</th>
            <th style="border:1px solid #ddd;padding:8px;">Price</th>
            <th style="border:1px solid #ddd;padding:8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td style="border:1px solid #ddd;padding:8px;">${item.productName}</td>
              <td style="border:1px solid #ddd;padding:8px;">${item.quantity}</td>
              <td style="border:1px solid #ddd;padding:8px;">₹${item.price}</td>
              <td style="border:1px solid #ddd;padding:8px;">₹${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <hr/>
      <p><strong>Total Amount:</strong> ₹${invoice.totalAmount}</p>
      <p><strong>GST (18%):</strong> ₹${invoice.gstAmount}</p>
      <p><strong>Grand Total:</strong> ₹${invoice.grandTotal}</p>
      <p><strong>Cashier:</strong> ${invoice.cashierName}</p>
      <p><strong>Payment Mode:</strong> ${invoice.paymentMode}</p>
      <hr/>
      <p style="text-align:center;color:#555;">Thank you for shopping with ${martInfo.name}!</p>
    </div>
  `;
};
