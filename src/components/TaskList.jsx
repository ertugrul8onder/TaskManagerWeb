import { useState } from 'react';
import TaskItem from './TaskItem';
import { useTaskContext } from '../context/TaskContext';
import styles from './TaskList.module.css';

function TaskList({ searchTerm }) {
  const { tasks, loading, error } = useTaskContext();
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className={styles.loading}>Görevler yükleniyor...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.taskList}>
      {filteredTasks.length === 0 ? (
        <div className={styles.emptyList}>Görev bulunamadı</div>
      ) : (
        filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            activeDeleteId={activeDeleteId}
            onDeleteClick={setActiveDeleteId}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;
