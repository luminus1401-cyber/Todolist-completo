// Data local de hoje em 'YYYY-MM-DD' (evita o deslocamento de fuso do toISOString).
export function todayString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' sem passar por Date (sem problemas de fuso).
export function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export function isOverdue(task) {
  return !task.completed && !!task.due_date && task.due_date.slice(0, 10) < todayString();
}
