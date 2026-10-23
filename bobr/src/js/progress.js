/* Postup v localStorage: { version: 2, tasks: { "sekce/uloha": { status, attempts, stars, seen } } }.
   Když úložiště nejde (anonymní režim), všechno běží dál jen v paměti. */
let key = null;
let tasks = {};

function read() {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    return d && d.version === 2 && d.tasks && typeof d.tasks === "object" ? d.tasks : {};
  } catch (e) { return {}; }
}

function save() {
  try { localStorage.setItem(key, JSON.stringify({ version: 2, tasks })); } catch (e) { /* jen v paměti */ }
}

export function init(storageKey) { key = storageKey; tasks = read(); }

export const allTasks = () => tasks;

export function getTask(id) {
  return { status: "new", attempts: 0, stars: 0, seen: false, ...tasks[id] };
}

export function updateTask(id, patch) {
  tasks[id] = { ...getTask(id), ...patch };
  save();
  return tasks[id];
}

export function reset() {
  tasks = {};
  try { localStorage.removeItem(key); } catch (e) { /* nic */ }
}

/* Změna v jiné záložce: znovu načte stav a zavolá fn(id => změnil se záznam úlohy?). */
export function onExternalChange(fn) {
  addEventListener("storage", e => {
    if (e.key !== key && e.key !== null) return;
    const old = tasks;
    tasks = read();
    fn(id => JSON.stringify(old[id]) !== JSON.stringify(tasks[id]));
  });
}
