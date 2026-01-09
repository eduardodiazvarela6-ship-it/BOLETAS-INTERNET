let cachedSha = null;

const decodeContent = (content) => {
  const decoded = atob(content.replace(/\n/g, ""));
  return JSON.parse(decoded);
};

const encodeContent = (data) => {
  return btoa(JSON.stringify(data, null, 2));
};

const getGitHubConfig = () => {
  const { owner, repo, path, token } = CONFIG.storage;
  return { owner, repo, path, token };
};

const fetchGitHubFile = async () => {
  const { owner, repo, path, token } = getGitHubConfig();
  if (!owner || !repo || !path || !token) {
    throw new Error("Configura el token y repositorio de GitHub.");
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo leer el archivo en GitHub.");
  }

  const data = await response.json();
  cachedSha = data.sha;
  return decodeContent(data.content);
};

const updateGitHubFile = async (payload) => {
  const { owner, repo, path, token } = getGitHubConfig();
  if (!cachedSha) {
    await fetchGitHubFile();
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: `Actualizar pagos ${new Date().toISOString()}`,
      content: encodeContent(payload),
      sha: cachedSha,
    }),
  });

  if (!response.ok) {
    throw new Error("Conflicto de concurrencia al guardar.");
  }

  const data = await response.json();
  cachedSha = data.content.sha;
  return payload;
};

const fallbackLoad = () => {
  const stored = localStorage.getItem("visionPayments");
  if (stored) {
    return JSON.parse(stored);
  }
  return { clientes: [] };
};

const fallbackSave = (payload) => {
  localStorage.setItem("visionPayments", JSON.stringify(payload));
  return payload;
};

const loadPaymentsData = async () => {
  try {
    return await fetchGitHubFile();
  } catch (error) {
    return fallbackLoad();
  }
};

const savePaymentsData = async (payload) => {
  try {
    return await updateGitHubFile(payload);
  } catch (error) {
    return fallbackSave(payload);
  }
};
