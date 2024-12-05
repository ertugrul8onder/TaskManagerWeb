import { useState } from 'react'
import styles from './SearchBar.module.css'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Görev ara..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
    </>
  )
}

export default SearchBar 