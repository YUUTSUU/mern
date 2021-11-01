import React, { useCallback, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useForm } from "../../hooks/form.hook"
import GoogleLogin from 'react-google-login'
import { toast } from 'react-toastify'
import axios from 'axios'
import "./login.scss"

const Login = () => {
  const { loading, setLoading, form, clearForm, handlerChange } = useForm();
  const { login } = useContext(AuthContext);

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      toast.info("Подождите...", {autoClose: 7000})
      setLoading(true)
      const response = await axios.post(`/api/auth/login`, { ...form })
      clearForm()
      setLoading(false)
      toast.dismiss()
      setTimeout(() => toast.success("Вход успешно выполнен", login(response.data.accessToken)), 0)
    } catch (error) {
      setLoading(false)
      console.log(error.message)
      toast.dismiss()
      if (error && error.response.data.message) toast.error(error.response.data.message)
    }
  }

  const handleResponse = async (data) => {
    try {
      toast.info("Подождите...")
      const response = await axios.post(`/api/auth/google`, { credential: data.tokenId })
      toast.dismiss()
      toast.success("Вход успешно выполнен", login(response.data.accessToken))
    } catch (error) {
      console.log(error.message)
      toast.dismiss()
      if (error && error.response.data.message) toast.error(error.response.data.message)
    }
  }

  const handleCredentialResponse = useCallback(async (data) => {
    try {
      toast.info("Подождите...", { autoClose: 7000 })
      const response = await axios.post(`/api/auth/google`, { credential: data.credential })
      toast.dismiss()
      toast.success("Вход успешно выполнен", login(response.data.accessToken))
    } catch (error) {
      console.log(error.message)
      toast.dismiss()
      if (error && error.response.data.message) toast.error(error.response.data.message)
    }
  }, [ login ])

  const googleSignIn = useCallback(async () => {
    try {
      /*global google */
      await google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        allowed_parent_origin: process.env.REACT_APP_API_CLIENT
      })
      await google.accounts.id.renderButton(document.getElementById("buttonDiv"),
        { theme: "filled_blue", size: "large", logo_alignment: "left", shape: "rectangular", width: 225, local: "ru-RU" }
      )
    } catch (err) { console.log(err.message) }
  }, [ handleCredentialResponse ])

  useEffect(() => {
    googleSignIn()
  }, [ googleSignIn ])

  return (
    <>
      <div className="container">
        <div className="login">
          <div className="inner">
            <h3>Авторизация</h3>
            <form className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="email-signin"
                    type="email"
                    name="email"
                    className="validate"
                    onChange={ handlerChange }
                  />
                  <label htmlFor="email-signin">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password-signin"
                    type="password"
                    name="password"
                    className="validate"
                    autoComplete="off"
                    onChange={ handlerChange }
                  />
                  <label htmlFor="password-signin">Пароль</label>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <button
                    type="submit"
                    className="waves-effect waves-light btn blue btn-auth"
                    disabled={ loading }
                    onClick={ loginHandler }
                  >Войти</button>
                  <Link to="/register" className="btn-outline btn-ml-2">Создать аккаунт</Link>
                </div>
              </div>
            </form>

            <div className="googleSignIn">
              <div id="buttonDiv"></div>
            </div>

            <div className="google">
              <GoogleLogin
                clientId="149361902691-mn9fpaisekc7mf7jvpce5hrr27h74vhm.apps.googleusercontent.com"
                buttonText="Вход через аккаунт Google"
                onSuccess={ handleResponse }
                cookiePolicy={ 'single_host_origin' }
                theme="dark"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;