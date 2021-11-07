import axios from "axios"

export const useHttp = () => {
  const storage = JSON.parse(localStorage.getItem("access_token"))

  const $api = axios.create({
    withCredentials: true,
    baseURL: process.env.API_SERVER
  })

  $api.interceptors.request.use(config => {
    return config.headers.Authorization = `Bearer ${ storage.accessToken }`
  })

  $api.interceptors.response.use(config => {

  })

  const login = async ({email, password}) => {
    return $api.post("/api/auth/login", {email, password})
  }

  const register = async ({name, email, password}) => {
    return $api.post("/api/auth/register", {name, email, password})
  }

  const logout = async () => {
    return $api.post("/api/auth/logout") 
  }

  return {login, register, logout}
}