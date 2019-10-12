import getEnvVars from '../../environment'
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

export const getUserData = (username, accessToken) => {
  return fetch(`${theAutoGroundApiUrl}/api/user/id/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
}

export const emailQRSticker = (username, carId, email, accessToken) => {
  return fetch(`${theAutoGroundApiUrl}/api/car/emailqrsticker/${username}/${carId}/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
}

export const getEvent = (username, eventId, accessToken) => {
  return fetch(`${theAutoGroundApiUrl}/api/event/id/${username}/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
}