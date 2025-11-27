const RECENT_BOARDS_KEY = 'trello_recent_boards'
const MAX_RECENT_BOARDS = 10

export const addRecentBoard = (board) => {
  const recent = getRecentBoards()

  // Remove if already exists
  const filtered = recent.filter(b => b._id !== board._id)

  // Add to front
  const updated = [
    { _id: board._id, title: board.title, visitedAt: Date.now() },
    ...filtered
  ].slice(0, MAX_RECENT_BOARDS)

  localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(updated))
}

export const getRecentBoards = () => {
  try {
    const data = localStorage.getItem(RECENT_BOARDS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const clearRecentBoards = () => {
  localStorage.removeItem(RECENT_BOARDS_KEY)
}

export const removeRecentBoard = (boardId) => {
  const recent = getRecentBoards()
  const filtered = recent.filter(b => b._id !== boardId)
  localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(filtered))
}
