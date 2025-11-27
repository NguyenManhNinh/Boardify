import axios from 'axios'
import { API_ROOT } from '~/utilities/constans'


export const getUserBoards = async () => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/boards`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const createBoard = async (data) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/boards`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const updateBoard = async (boardId, data) => {
  try {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
