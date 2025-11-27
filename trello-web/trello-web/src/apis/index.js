import axios from 'axios'
import { API_ROOT } from '~/utilities/constans'

// Auth APIs
export const registerApi = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/register`, data)
  return response.data
}

export const loginApi = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/login`, data)
  return response.data
}

export const forgotPasswordApi = async (email) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/forgot-password`, { email })
  return response.data
}

export const resetPasswordApi = async (token, password) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/reset-password`, { token, password })
  return response.data
}

export const logoutApi = async (token) => {
  const response = await axios.post(
    `${API_ROOT}/v1/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const getProfileApi = async (token) => {
  const response = await axios.get(`${API_ROOT}/v1/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const updateProfileApi = async (token, data) => {
  const response = await axios.put(
    `${API_ROOT}/v1/auth/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

//Api Board
export const fetchBoardDetailsApi = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/V1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsApi = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/V1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/V1/boards/supports/moving_cards`, updateData)
  return response.data
}

export const deleteBoardApi = async (boardId, token) => {
  const response = await axios.delete(`${API_ROOT}/V1/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

//Api Column
export const createNewColumnApi = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/V1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsApi = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/V1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsApi = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/V1/columns/${columnId}`)
  return response.data
}

//Api Card
export const createNewCardApi = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/V1/cards`, newCardData)
  return response.data
}

export const updateCardApi = async (cardId, data) => {
  const response = await axios.put(`${API_ROOT}/V1/cards/${cardId}`, data)
  return response.data
}

// Attachment APIs
export const uploadCardAttachment = async (token, cardId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(
    `${API_ROOT}/V1/cards/${cardId}/attachments`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}

export const deleteCardAttachment = async (token, cardId, attachmentUrl) => {
  const response = await axios.delete(
    `${API_ROOT}/V1/cards/${cardId}/attachments`,
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { attachmentUrl }
    }
  )
  return response.data
}

// Cover APIs
export const setCardCover = async (token, cardId, coverData) => {
  const response = await axios.patch(
    `${API_ROOT}/V1/cards/${cardId}/cover`,
    coverData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

export const removeCardCover = async (token, cardId) => {
  const response = await axios.delete(
    `${API_ROOT}/V1/cards/${cardId}/cover`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

// Google Drive APIs
export const connectGoogleDriveApi = async (token) => {
  const response = await axios.get(`${API_ROOT}/v1/auth/google`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const backupToGoogleDriveApi = async (token, boardId) => {
  const response = await axios.post(
    `${API_ROOT}/v1/boards/${boardId}/backup/google-drive`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

// User APIs
export const fetchUsersAPI = async (token, searchQuery) => {
  const response = await axios.get(`${API_ROOT}/v1/users?q=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const searchUsersApi = async (query, token) => {
  const response = await axios.get(
    `${API_ROOT}/v1/users?q=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

// Board Member Management APIs
export const getBoardMembersApi = async (boardId, token) => {
  const response = await axios.get(
    `${API_ROOT}/v1/boards/${boardId}/members`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

export const addBoardMemberApi = async (boardId, userId, token) => {
  const response = await axios.post(
    `${API_ROOT}/v1/boards/${boardId}/members`,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

export const removeBoardMemberApi = async (boardId, userId, token) => {
  const response = await axios.delete(
    `${API_ROOT}/v1/boards/${boardId}/members/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

// Board Invitation APIs
export const sendBoardInvitationApi = async (boardId, email, token) => {
  const response = await axios.post(
    `${API_ROOT}/v1/boards/${boardId}/invitations`,
    { email },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response.data
}

export const acceptBoardInvitationApi = async (token, authToken) => {
  const response = await axios.post(
    `${API_ROOT}/v1/invitations/accept`,
    { token },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  )
  return response.data
}