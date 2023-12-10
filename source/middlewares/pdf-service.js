PDFDocument = require("pdfkit");

function buildPDF(
  orderData,
  customerName,
  orderDetails,
  dataCallback,
  endCallback
) {
  const doc = new PDFDocument();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(18).text(`Customer Name: ${customerName}`, { align: "center" });
  doc.moveDown();

  doc.fontSize(18).text(`Order Details:`, { align: "center" });
  doc.moveDown();

  orderDetails.forEach((detail) => {
    doc
      .fontSize(14)
      .text(
        `Product: ${detail.product.productName}` +
          "    " +
          `Price: ${detail.product.retailPrice}` +
          "    " +
          `Quantity: ${detail.quantity}` +
          "    " +
          `Total Price: ${detail.totalPrice}`
      );

    doc.moveDown();
  });
  const formattedDate = orderData.creationDate.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  doc.fontSize(13).text(`Creation date : ${formattedDate}`, { align: "left" });
  doc.moveDown();
  doc.moveDown();
  doc.fontSize(18).text(`Customer give : ${orderData.give}`, { align: "left" });
  doc
    .fontSize(18)
    .text(`Total bill    : ${orderData.totalBill}`, { align: "left" });
  doc
    .fontSize(18)
    .text(`Receive back  : ${orderData.payback}`, { align: "left" });

  doc.end();
}

module.exports = { buildPDF };
