import {BrowserRouter} from 'react-router-dom'
import {useRoutes} from '../routes/routes'
import {AuthContext} from "../context/authContext"
import {useAuth} from "../hooks/auth.hook"
import Navbar from "../components/navbar/navbar"
import {ToastContainer, Slide} from 'react-toastify'
import "./app.scss"

function App({text}) {
  const {login, logout, name, token, userId} = useAuth()
  const isAuthentication = !!token
  const routes = useRoutes(isAuthentication)

  return (
    <>
      <AuthContext.Provider value={{login, logout, name, userId, isAuthentication}}>
        <ToastContainer limit={2} transition={Slide} draggablePercent={60} closeButton={false} pauseOnFocusLoss={false} hideProgressBar={false} position="top-right" closeOnClick={false} />
        <BrowserRouter>
          <Navbar />
          {routes}
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}

export default App;
