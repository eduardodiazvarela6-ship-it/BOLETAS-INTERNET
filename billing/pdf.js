const loadJsPdf = () => {
  if (window.jspdf) {
    return Promise.resolve(window.jspdf.jsPDF);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = () => reject(new Error("No se pudo cargar jsPDF."));
    document.head.appendChild(script);
  });
};

const generateInvoicePDF = async ({ client, monthKey, status }) => {
  const JsPdf = await loadJsPdf();
  const doc = new JsPdf();
  const now = new Date();

  doc.setFontSize(16);
  doc.text(CONFIG.appName, 14, 20);
  doc.setFontSize(12);
  doc.text(`Cliente: ${client.nombre}`, 14, 32);
  doc.text(`Correo: ${client.correo}`, 14, 40);
  doc.text(`Mes: ${monthKey}`, 14, 48);
  doc.text(`Monto: S/ ${client.monto.toFixed(2)}`, 14, 56);
  doc.text(`Estado: ${status}`, 14, 64);
  doc.text(`Código: ${client.id}-${monthKey.replace("-", "")}`, 14, 72);
  doc.text(`Generado: ${now.toLocaleString()}`, 14, 80);

  doc.save(`boleta-${client.id}-${monthKey}.pdf`);
};
