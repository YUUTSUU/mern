import React, {useContext} from 'react'
import {AuthContext} from '../../context/authContext'
import {Link} from 'react-router-dom'
import {useForm} from "../../hooks/form.hook"
import {toast} from 'react-toastify'
import axios from 'axios'
import "./register.scss"

const Register = () => {
  const {loading, setLoading, form, formHandler, clearForm } = useForm()
  const {login} = useContext(AuthContext)

  const registerHandler = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      toast.info("Подождите...")
      const response = await axios.post(`/api/auth/register`, {...form})
      clearForm()
      setLoading(false)
      if (typeof response.data.accessToken === "string") {
        toast.success(response.data.message)
        toast.success("Добро пожаловать!", login(response.data.accessToken))
      }
    } catch (error) {
      setLoading(false)
      toast.dismiss()
      if (error && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Запрос не выполнен...")
      }
    }
  }

  return (
    <>
      <div className="container">
        <div className="register">
          <div className="inner">
            <h3>Регистрация</h3>
            <form className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="name-signup"
                    type="text"
                    name="name"
                    className="validate"
                    onChange={formHandler}
                    value={form.name}
                  />
                  <label htmlFor="name-signup">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="email-signup"
                    type="email"
                    name="email"
                    className="validate"
                    onChange={formHandler}
                    value={form.email}
                  />
                  <label htmlFor="email-signup">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password-signup"
                    type="password"
                    name="password"
                    className="validate"
                    autoComplete="off"
                    onChange={formHandler}
                    value={form.password}
                  />
                  <label htmlFor="password-signup">Пароль</label>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <button
                    type="submit"
                    className="waves-effect waves-light btn blue btn-auth"
                    disabled={loading}
                    onClick={registerHandler}
                  >Создать аккаунт</button>
                  <Link to="/login" className="btn-outline btn-ml-2">Войти в аккаунт</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;