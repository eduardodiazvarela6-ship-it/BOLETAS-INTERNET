const loadEmailJs = () => {
  if (window.emailjs) {
    return Promise.resolve(window.emailjs);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = () => resolve(window.emailjs);
    script.onerror = () => reject(new Error("No se pudo cargar EmailJS."));
    document.head.appendChild(script);
  });
};

const sendInvoiceEmail = async ({ client, monthKey }) => {
  if (!CONFIG.email.serviceId || !CONFIG.email.templateId || !CONFIG.email.publicKey) {
    throw new Error("EmailJS no está configurado.");
  }

  const emailjs = await loadEmailJs();
  emailjs.init(CONFIG.email.publicKey);

  return emailjs.send(CONFIG.email.serviceId, CONFIG.email.templateId, {
    to_name: client.nombre,
    to_email: client.correo,
    month: monthKey,
    amount: `S/ ${client.monto.toFixed(2)}`,
    status: client.historial?.[monthKey] || "pendiente",
  });
};

window.addEventListener("vision:email", async (event) => {
  const { client, monthKey } = event.detail;

  try {
    await sendInvoiceEmail({ client, monthKey });
    alert("Correo enviado correctamente.");
  } catch (error) {
    alert("No se pudo enviar el correo. Descarga la boleta manualmente.");
  }
});
