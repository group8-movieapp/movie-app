import { useState } from 'react'

export function useNavigation() {
  const [page, setPage] = useState('home')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null)

  const handleNavigate = (nextPage) => {
    setSelectedMovie(null)
    setSelectedGroupId(null)
    setPage(nextPage)
  }

  // Ryhmän valinta
  const handleSelectGroup = (groupId) => {
    setSelectedMovie(null)
    setSelectedGroupId(groupId)
    setPage('groupDetail')
  }

  return {
    page,
    setPage,
    selectedMovie,
    setSelectedMovie,
    selectedGroupId,
    handleNavigate,
    handleSelectGroup,
  }
}

//Tänne siirretty sivujen vaihtamisen logiikka ja ryhmän valinnan logiikkaa. 