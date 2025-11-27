import axios from 'axios'
import { API_ROOT } from '~/utilities/constans'


// Get user profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    // Process avatar URL for GridFS files
    const resultData = response.data
    const userData = resultData.data
    if (userData && userData.avatar) {
      // If avatar is a GridFS ID (not a data URL), construct the download URL
      if (userData.avatarType === 'gridfs' && !userData.avatar.startsWith('data:') && !userData.avatar.startsWith('http')) {
        userData.avatar = `${API_ROOT}/v1/auth/avatar/${userData.avatar}`
      }
    }

    return resultData
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get recent activities
export const getRecentActivities = async () => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/user/activities`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Hide activity
export const hideActivity = async (activityId) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/user/activities/hide`,
      { activityId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Update bio
export const updateBio = async (bio) => {
  try {
    const response = await axios.put(`${API_ROOT}/v1/user/bio`,
      { bio },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Update avatar
// Update avatar
export const updateAvatar = async (avatarUrl) => {
  try {
    const response = await axios.post(
      `${API_ROOT}/v1/user/avatar`,
      { avatarUrl },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Update user settings
export const updateSettings = async (data) => {
  try {
    const response = await axios.put(
      `${API_ROOT}/v1/user/settings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Change password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_ROOT}/v1/user/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
