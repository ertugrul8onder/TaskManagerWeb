import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'

const TaskContext = createContext()

const initialState = {
  tasks: [],
  loading: false,
  error: null,
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'TASKS_LOADING':
      return { ...state, loading: true, error: null }

    case 'TASKS_LOADED':
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: null
      }

    case 'TASKS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const getAllTasks = async () => {
    dispatch({ type: 'TASKS_LOADING' })
    try {
      const response = await fetch('https://taskmanagerapi.ertugrulonder.com/api/Tasks')
      if (!response.ok) {
        throw new Error('Görevler yüklenirken bir hata oluştu')
      }
      const data = await response.json()
      dispatch({ type: 'TASKS_LOADED', payload: data })
    } catch (err) {
      dispatch({ type: 'TASKS_ERROR', payload: err.message })
    }
  }

  const createTask = async (newTask) => {
    try {
      const response = await fetch('https://taskmanagerapi.ertugrulonder.com/api/Tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
      })

      if (!response.ok) {
        throw new Error('Görev eklenirken bir hata oluştu')
      }

      const data = await response.json()
      console.log(data)
      dispatch({ type: 'ADD_TASK', payload: data })
    } catch (err) {
      dispatch({ type: 'TASKS_ERROR', payload: err.message })
    }
  }

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await fetch(`https://taskmanagerapi.ertugrulonder.com/api/Tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask)
      });

      if (!response.ok) {
        throw new Error('Görev güncellenirken bir hata oluştu');
      }

      const updatedTaskData = {
        ...state.tasks.find(task => task.id === id),
        ...updatedTask,
        id
      };
      
      dispatch({ type: 'UPDATE_TASK', payload: updatedTaskData });
    } catch (err) {
      dispatch({ type: 'TASKS_ERROR', payload: err.message });
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`https://taskmanagerapi.ertugrulonder.com/api/Tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Görev silinirken bir hata oluştu');
      }

      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (err) {
      dispatch({ type: 'TASKS_ERROR', payload: err.message });
    }
  };

  useEffect(() => {
    getAllTasks()
  }, [])

  const value = useMemo(() => ({
    ...state,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
  }), [state]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
} 