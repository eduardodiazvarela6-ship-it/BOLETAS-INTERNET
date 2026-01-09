const tableBody = document.getElementById("clientsTable");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");
const clientForm = document.getElementById("clientForm");
const currentDate = document.getElementById("currentDate");

const statClients = document.getElementById("statClients");
const statPending = document.getElementById("statPending");
const statPaid = document.getElementById("statPaid");
const statDebt = document.getElementById("statDebt");

let paymentsData = { clientes: [] };

const monthLabels = [
  { key: "01", label: "Enero", short: "Ene" },
  { key: "02", label: "Febrero", short: "Feb" },
  { key: "03", label: "Marzo", short: "Mar" },
  { key: "04", label: "Abril", short: "Abr" },
  { key: "05", label: "Mayo", short: "May" },
  { key: "06", label: "Junio", short: "Jun" },
  { key: "07", label: "Julio", short: "Jul" },
  { key: "08", label: "Agosto", short: "Ago" },
  { key: "09", label: "Septiembre", short: "Sep" },
  { key: "10", label: "Octubre", short: "Oct" },
  { key: "11", label: "Noviembre", short: "Nov" },
  { key: "12", label: "Diciembre", short: "Dic" },
];

const todayMonth = () => {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
  };
};

const buildMonthKey = () => `${yearSelect.value}-${monthSelect.value}`;

const populateMonthOptions = () => {
  monthSelect.innerHTML = "";
  monthLabels.forEach((month) => {
    const option = document.createElement("option");
    option.value = month.key;
    option.textContent = month.label;
    monthSelect.appendChild(option);
  });
};

const populateYearOptions = () => {
  yearSelect.innerHTML = "";
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  });
};

const calculateDebt = (client) => {
  const entries = Object.values(client.historial || {});
  const pendingCount = entries.filter((value) => value === "pendiente").length;
  return pendingCount * client.monto;
};

const calculatePendingMonths = (client) => {
  return Object.values(client.historial || {}).filter((value) => value === "pendiente").length;
};

const buildClientId = () => {
  const ids = paymentsData.clientes.map((client) => parseInt(client.id.replace("CL", ""), 10));
  const nextId = ids.length ? Math.max(...ids) + 1 : 1;
  return `CL${String(nextId).padStart(3, "0")}`;
};

const ensureMonth = (client, monthKey) => {
  if (!client.historial) {
    client.historial = {};
  }
  if (!client.historial[monthKey]) {
    client.historial[monthKey] = "pendiente";
  }
};

const updateStats = (monthKey) => {
  const totalClients = paymentsData.clientes.length;
  let totalPending = 0;
  let totalPaid = 0;
  let totalDebt = 0;

  paymentsData.clientes.forEach((client) => {
    ensureMonth(client, monthKey);
    const status = client.historial[monthKey];
    if (status === "pagado") {
      totalPaid += 1;
    } else {
      totalPending += 1;
    }
    totalDebt += calculateDebt(client);
  });

  statClients.textContent = totalClients;
  statPending.textContent = totalPending;
  statPaid.textContent = totalPaid;
  statDebt.textContent = `S/ ${totalDebt.toFixed(2)}`;
};

const renderTable = () => {
  const monthKey = buildMonthKey();
  const statusValue = statusFilter.value;
  const searchValue = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  const filtered = paymentsData.clientes.filter((client) => {
    ensureMonth(client, monthKey);
    const status = client.historial[monthKey];
    const matchesStatus = statusValue === "all" || status === statusValue;
    const matchesSearch =
      client.nombre.toLowerCase().includes(searchValue) ||
      client.correo.toLowerCase().includes(searchValue);
    return matchesStatus && matchesSearch;
  });

  filtered.forEach((client) => {
    const status = client.historial[monthKey];
    const row = document.createElement("tr");

    const yearValue = yearSelect.value;
    const monthGrid = monthLabels
      .map((month) => {
        const gridMonthKey = `${yearValue}-${month.key}`;
        ensureMonth(client, gridMonthKey);
        const gridStatus = client.historial[gridMonthKey];
        const statusClass = gridStatus === "pagado" ? "paid" : "pending";
        const statusLabel = gridStatus === "pagado" ? "Pagado" : "Pendiente";
        return `<span class="month-chip ${statusClass}" title="${month.label} ${yearValue} · ${statusLabel}">${month.short}</span>`;
      })
      .join("");

    row.innerHTML = `
      <td>${client.id}</td>
      <td>${client.nombre}</td>
      <td>${client.correo}</td>
      <td>S/ ${client.monto.toFixed(2)}</td>
      <td><div class="month-grid">${monthGrid}</div></td>
      <td>
        <span class="badge ${status === "pagado" ? "success" : "danger"}">
          ${status === "pagado" ? "🟢 Pagado" : "🔴 Pendiente"}
        </span>
      </td>
      <td>
        <div class="actions">
          <button class="btn btn-success" data-action="paid" data-id="${client.id}">✅ Pagado</button>
          <button class="btn btn-danger" data-action="pending" data-id="${client.id}">❌ No pagado</button>
          <button class="btn btn-secondary" data-action="invoice" data-id="${client.id}">🧾 Boleta</button>
          <button class="btn btn-secondary" data-action="email" data-id="${client.id}">📧 Enviar correo</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateStats(monthKey);
};

const saveAndRender = async () => {
  await savePaymentsData(paymentsData);
  renderTable();
};

const handleAction = async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  const clientId = button.dataset.id;
  const client = paymentsData.clientes.find((item) => item.id === clientId);
  if (!client) {
    return;
  }

  const monthKey = buildMonthKey();
  ensureMonth(client, monthKey);

  if (action === "paid") {
    if (!confirm("¿Confirmar pago recibido?")) {
      return;
    }
    client.historial[monthKey] = "pagado";
    await saveAndRender();
  }

  if (action === "pending") {
    if (!confirm("¿Confirmar marcar como pendiente?")) {
      return;
    }
    client.historial[monthKey] = "pendiente";
    await saveAndRender();
  }

  if (action === "invoice") {
    window.dispatchEvent(new CustomEvent("vision:invoice", { detail: { client, monthKey } }));
  }

  if (action === "email") {
    window.dispatchEvent(new CustomEvent("vision:email", { detail: { client, monthKey } }));
  }
};

clientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = document.getElementById("clientName").value.trim();
  const correo = document.getElementById("clientEmail").value.trim();
  const monto = parseFloat(document.getElementById("clientAmount").value);
  const monthKey = buildMonthKey();

  if (!nombre || !correo || Number.isNaN(monto)) {
    return;
  }

  const newClient = {
    id: buildClientId(),
    nombre,
    correo,
    monto,
    historial: {
      [monthKey]: "pendiente",
    },
  };

  paymentsData.clientes.push(newClient);
  clientForm.reset();
  await saveAndRender();
});

tableBody.addEventListener("click", handleAction);
statusFilter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);
monthSelect.addEventListener("change", renderTable);
yearSelect.addEventListener("change", renderTable);

refreshButton.addEventListener("click", async () => {
  paymentsData = await loadPaymentsData();
  renderTable();
});

const init = async () => {
  const { year, month } = todayMonth();
  populateYearOptions();
  populateMonthOptions();
  yearSelect.value = year;
  monthSelect.value = month;

  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  paymentsData = await loadPaymentsData();
  renderTable();
};

init();
