const getSession = () => {
  const sessionRaw = sessionStorage.getItem("visionSession");
  if (!sessionRaw) {
    return null;
  }
  try {
    return JSON.parse(sessionRaw);
  } catch (error) {
    sessionStorage.removeItem("visionSession");
    return null;
  }
};

const session = getSession();
if (!session) {
  window.location.href = "auth/login.html";
}

const sessionUser = document.getElementById("sessionUser");
if (sessionUser && session) {
  sessionUser.textContent = `Hola, ${session.username}`;
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("visionSession");
    window.location.href = "auth/login.html";
  });
}
