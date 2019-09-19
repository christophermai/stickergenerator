import getEnvVars from '../../environment'
import axios from 'axios'
const { theAutoGroundApiUrl } = getEnvVars();

export const login = (data) => {
  return fetch(`${theAutoGroundApiUrl}/api/token/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
export const refreshToken = (refreshData) => {
  return fetch(`${theAutoGroundApiUrl}/api/token/refreshtoken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(refreshData)
  })
}

export const emailQRSticker = (username, carId, email, accessToken) => {
  return axios.get(`${theAutoGroundApiUrl}/api/car/emailqrsticker/${username}/${carId}/${email}`, {
    responseType: 'arraybuffer',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
}