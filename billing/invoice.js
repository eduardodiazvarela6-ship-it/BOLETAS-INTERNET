const notify = (message) => {
  alert(message);
};

window.addEventListener("vision:invoice", async (event) => {
  const { client, monthKey } = event.detail;
  const status = client.historial?.[monthKey] || "pendiente";

  try {
    await generateInvoicePDF({ client, monthKey, status });
  } catch (error) {
    notify("No se pudo generar la boleta. Puedes intentar nuevamente.");
  }
});
