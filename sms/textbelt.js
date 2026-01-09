const sendReminder = async () => {
  const owner = process.env.OWNER_NAME || "Eomar Frank";
  const phone = process.env.SMS_PHONE;
  const key = process.env.TEXTBELT_KEY || "textbelt";
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const message = `${owner}: revisa los pagos del mes ${monthKey}`;

  if (!phone) {
    throw new Error("Falta SMS_PHONE en variables.");
  }

  const response = await fetch("https://textbelt.com/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      message,
      key,
    }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "TextBelt fallo");
  }

  console.log("SMS enviado", result);
};

sendReminder().catch((error) => {
  console.error("Error enviando SMS", error.message);
  process.exit(1);
});
