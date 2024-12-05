import { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import styles from './TaskForm.module.css'

function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const { createTask } = useTaskContext()

  const validateInput = (value, maxLength, fieldName) => {
    if (value.length > maxLength) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `En fazla ${maxLength} karakter girebilirsiniz`
      }))
      return false
    }
    setErrors(prev => ({ ...prev, [fieldName]: null }))
    return true
  }

  const handleTitleChange = (e) => {
    const value = e.target.value
    if (validateInput(value, 100, 'title')) {
      setTitle(value)
    }
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    if (validateInput(value, 500, 'description')) {
      setDescription(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    await createTask({ title, description })
    setTitle('')
    setDescription('')
    setErrors({})
  }

  const isFormValid = !errors.title && !errors.description && title.trim()

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Görev başlığı"
          value={title}
          onChange={handleTitleChange}
          className={styles.input}
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder="Görev açıklaması"
          rows={3}
          value={description}
          onChange={handleDescriptionChange}
          className={styles.textarea}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>
      <button
        type="submit"
        className={`${styles.button} ${!isFormValid ? styles.disabled : ''}`}
        disabled={!isFormValid}
      >
        Görev Ekle
      </button>
    </form>
  )
}

export default TaskForm 