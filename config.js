const CONFIG = {
  appName: "VISION-INTERNET: Control de Pagos",
  ownerName: "Eomar Frank",

  auth: {
    username: "admin",
    // password: admin123 (ejemplo, cambia luego)
    passwordHash: "31dd3bd6f18f2aa5d3373f1744deb208d888de71f0127fee99e76a2e1b54130a",
  },

  storage: {
    owner: "eduardodiazvarela6-ship-it", // tu usuario de GitHub
    repo: "BOLETAS-INTERNET",
    path: "data/payments.json",
    token: "", // GitHub Token si luego lo necesitas
  },

  email: {
    provider: "emailjs",
    serviceId: "",
    templateId: "",
    publicKey: "",
  },

  sms: {
    textbeltKey: "textbelt", // gratis (1 SMS/día)
    phone: "",
  },
};
