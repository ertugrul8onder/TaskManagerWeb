import React, { useState, useRef, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import styles from './TaskItem.module.css';

const TaskItem = React.memo(({ task, activeDeleteId, onDeleteClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const { updateTask, deleteTask } = useTaskContext();
  const deleteConfirmRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteConfirmRef.current && !deleteConfirmRef.current.contains(event.target)) {
        onDeleteClick(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDeleteClick]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const handleUpdate = async () => {
    if (!editedTitle.trim()) return;

    await updateTask(task.id, {
      title: editedTitle,
      description: editedDescription
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onDeleteClick(null);
  };

  const showDeleteConfirm = activeDeleteId === task.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskContent}>
        {isEditing ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className={styles.editInput}
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className={styles.editTextarea}
            />
            <div className={styles.editButtons}>
              <button type="submit" className={styles.saveButton}>
                Kaydet
              </button>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                İptal
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            <p className={styles.taskDescription}>{task.description}</p>
            <span className={styles.taskDate}>{formatDate(task.createdAt)}</span>
          </>
        )}
      </div>
      {!isEditing && (
        <div className={styles.taskActions}>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            Düzenle
          </button>
          <div className={styles.deleteContainer}>
            <button
              onClick={() => onDeleteClick(task.id)}
              className={styles.deleteButton}
            >
              Sil
            </button>
            {showDeleteConfirm && (
              <div ref={deleteConfirmRef} className={styles.deleteConfirm}>
                <p>Silmek istediğinize emin misiniz?</p>
                <div className={styles.confirmButtons}>
                  <button onClick={handleDelete} className={styles.confirmButton}>
                    Evet
                  </button>
                  <button
                    onClick={() => onDeleteClick(null)}
                    className={styles.cancelButton}
                  >
                    Hayır
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskItem;
