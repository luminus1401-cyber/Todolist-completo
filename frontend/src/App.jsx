import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { useDebounce } from './hooks/useDebounce.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';
import { PlusIcon } from './components/Icons.jsx';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // modal: null (fechado) | { task: null } (criar) | { task } (editar)
  const [modal, setModal] = useState(null);

  // A busca só dispara depois que o usuário para de digitar.
  const debouncedSearch = useDebounce(search.trim(), 400);

  const load = useCallback(async () => {
    try {
      const data = await api.list({ search: debouncedSearch, status });
      setTasks(data.tasks);
      setTotals({ total: data.total, completed: data.completed });
      setError('');
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action) {
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const handleToggle = (task) => run(() => api.update(task.id, { completed: !task.completed }));

  const handleDelete = (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) run(() => api.remove(task.id));
  };

  async function handleSubmit(payload) {
    if (modal.task) await api.update(modal.task.id, payload);
    else await api.create(payload);
    setModal(null);
    await load();
  }

  const uncompleted = totals.total - totals.completed;

  return (
    <main className="page">
      <section className="card">
        <h1>To Do List</h1>

        <input
          type="search"
          className="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />

        <div className="filters" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`chip ${status === f.value ? 'active' : ''}`}
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h2>Task List</h2>

        {error && <p className="banner-error" role="alert">{error}</p>}

        {loading ? (
          <p className="empty">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">You have no pending tasks.</p>
        ) : (
          <ul className="tasks">
            {tasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={handleToggle}
                onEdit={(task) => setModal({ task })}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}

        <footer className="counters">
          Completed: {totals.completed} | Uncompleted: {uncompleted}
        </footer>
      </section>

      <button type="button" className="fab" onClick={() => setModal({ task: null })} aria-label="Create task" title="Create task">
        <PlusIcon />
      </button>

      {modal && <TaskModal task={modal.task} onClose={() => setModal(null)} onSubmit={handleSubmit} />}
    </main>
  );
}
