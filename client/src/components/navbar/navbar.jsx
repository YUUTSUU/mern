import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../../context/authContext'
import axios from 'axios'
import "./navbar.scss"

const Navbar = () => {
  const {isAuthentication, name, logout} = useContext(AuthContext)

  const logoutHandler = async () => {
    try {
      logout()
      await axios.post(`/api/auth/logout`)
    } catch (error) {
      console.log(error.message)
      if (error && error.response.data.message) console.log(error.response.data.message)
    }
  }

  return (
    <>
      <nav>
        <div className="nav-wrapper navbar blue">
          <Link to="/" className="brand-logo">MERN App</Link>
          {
            isAuthentication ?
              (<ul id="nav-mobile" className="right hide-on-med-and-down">
                <li className="mr">Добро пожаловать {name} </li>
                <li>
                  <Link to="/login" onClick={logoutHandler}>Выйти</Link>
                </li>
              </ul>)
              :
              (<ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <Link to="/login" >Войти</Link>
                </li>
              </ul>)
          }
        </div>
      </nav>
    </>
  )
}

export default Navbar