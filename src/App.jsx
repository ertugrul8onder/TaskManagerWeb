import TaskList from './components/TaskList'
import SearchBar from './components/SearchBar'
import TaskForm from './components/TaskForm'
import { TaskProvider } from './context/TaskContext'
import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <TaskProvider>
      <div className="container">
        <h1>Görev Listesi</h1>
        <TaskForm />
        <div className="divider"></div>
        <SearchBar onSearch={setSearchTerm} />
        <TaskList searchTerm={searchTerm} />
      </div>
    </TaskProvider>
  )
}

export default App
