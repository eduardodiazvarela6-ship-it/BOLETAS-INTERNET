const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const hashPassword = async (plainText) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const saveSession = (username) => {
  const session = {
    username,
    loginAt: new Date().toISOString(),
  };
  sessionStorage.setItem("visionSession", JSON.stringify(session));
};

const showMessage = (message, type = "") => {
  loginMessage.textContent = message;
  loginMessage.className = type;
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  if (!username || !password) {
    showMessage("Completa los datos.", "danger");
    return;
  }

  const incomingHash = await hashPassword(password);

  if (username === CONFIG.auth.username && incomingHash === CONFIG.auth.passwordHash) {
    saveSession(username);
    window.location.href = "../index.html";
  } else {
    showMessage("Usuario o contraseña incorrecta.", "danger");
  }
});
