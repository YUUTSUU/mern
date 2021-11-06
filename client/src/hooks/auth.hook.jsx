import {useState, useEffect, useCallback} from 'react'

export const useAuth = () => {
  const jwt = require("jsonwebtoken")
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [name, setName] = useState(null)

  const login = useCallback((accessToken) => {
    const {name, userId} = jwt.decode(accessToken)
    setToken(accessToken)
    setName(name)
    setUserId(userId)

    localStorage.setItem("access_token", JSON.stringify({accessToken}))
  }, [jwt])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem("access_token")
  }, []);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("access_token"))
    if (storage && storage.accessToken) login(storage.accessToken)
  }, [login])

  return {login, logout, name, token, userId};
}