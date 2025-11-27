const STARRED_BOARDS_KEY = 'trello_starred_boards'

export const toggleStarredBoard = (board) => {
  const starred = getStarredBoards()
  const exists = starred.find(b => b._id === board._id)

  let updated
  if (exists) {
    // Unstar
    updated = starred.filter(b => b._id !== board._id)
  } else {
    // Star
    updated = [{ _id: board._id, title: board.title }, ...starred]
  }

  localStorage.setItem(STARRED_BOARDS_KEY, JSON.stringify(updated))
  return !exists // Return new starred status
}

export const isStarredBoard = (boardId) => {
  const starred = getStarredBoards()
  return starred.some(b => b._id === boardId)
}

export const getStarredBoards = () => {
  try {
    const data = localStorage.getItem(STARRED_BOARDS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
