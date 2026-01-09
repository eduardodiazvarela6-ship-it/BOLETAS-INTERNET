# BOLETAS-INTERNET

Sistema web gratuito para control de pagos, boletas y recordatorios para **VISION-INTERNET**.

## ✅ Características

- Login privado con hash SHA-256.
- Almacenamiento en `data/payments.json` vía GitHub API.
- Panel de clientes, pagos y deuda acumulada.
- Boleta PDF con jsPDF.
- Envío opcional por EmailJS.
- Recordatorio SMS mensual con TextBelt + GitHub Actions.

## 🚀 Configuración rápida

1. Copia `config.js` y completa tus datos:
   - `auth.passwordHash`: hash SHA-256 de tu contraseña.
   - `storage.owner`, `storage.repo`, `storage.path` y `storage.token`.
   - Datos opcionales de EmailJS.
2. Abre `auth/login.html` en tu navegador.
3. Inicia sesión y gestiona clientes.

## 🧠 Hash de contraseña

Puedes generar un hash SHA-256 con cualquier herramienta online o desde consola:

```bash
node -e "const crypto=require('crypto');console.log(crypto.createHash('sha256').update('mi-clave').digest('hex'))"
```

## 📲 SMS mensual (TextBelt)

Configura los secretos en GitHub:

- `TEXTBELT_KEY`: llave de TextBelt (free).
- `SMS_PHONE`: número destino con código país.
- `OWNER_NAME`: nombre del owner (opcional).

El workflow se ejecuta el día 1 de cada mes.

## 📧 Email (opcional)

Configura los datos en `config.js` con EmailJS. Si no lo haces, el botón mostrará una alerta de falla y podrás descargar la boleta manualmente.

## 🧩 Estructura

```
/auth
  login.html
  auth.js
  session.js
/billing
  pdf.js
  invoice.js
/data
  payments.json
/email
  email.js
/js
  storage.js
  payments.js
/sms
  textbelt.js
```

## 🔒 Reglas

- 100% gratuito.
- Sin bases de datos externas.
- Todo se guarda en GitHub.
