import { PencilIcon, TrashIcon } from './Icons.jsx';
import { formatDate, isOverdue } from '../utils.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const completed = Boolean(task.completed);
  const overdue = isOverdue(task);

  const cls = ['task', completed && 'is-done', overdue && 'is-overdue'].filter(Boolean).join(' ');

  return (
    <li className={cls}>
      <label className="task-main">
        <input
          type="checkbox"
          className="check"
          checked={completed}
          onChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" as ${completed ? 'pending' : 'completed'}`}
        />
        <span className="task-text">
          <span className="task-title">{task.title}</span>
          {task.due_date && (
            <span className="task-meta">
              Até {formatDate(task.due_date)}
              {overdue && <span className="badge">Em atraso</span>}
            </span>
          )}
        </span>
      </label>

      <div className="task-actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
          <PencilIcon />
        </button>
        <button type="button" className="icon-btn danger" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
