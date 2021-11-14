import {BrowserRouter} from 'react-router-dom'
import {ToastContainer, Slide} from 'react-toastify'
import {useRoutes} from './routes/routes'
import {AuthContext} from "./context/authContext"
import {useAuth} from "./hooks/storage.hook"
import Navbar from "./components/navbar/navbar"
import "./App.css"

import {Provider} from "react-redux"
import {store} from "./redux/store"

function App() {
  const {login, logout, name, token, userId} = useAuth()
  const isAuthentication = !!token
  const routes = useRoutes(isAuthentication)

  return (
    <>
      <Provider store={store}>
        <AuthContext.Provider value={{login, logout, name, userId, isAuthentication}}>
          <ToastContainer
            limit={2}
            transition={Slide}
            draggablePercent={60}
            closeButton={false}
            pauseOnFocusLoss={false}
            hideProgressBar={false}
            position="top-right"
            closeOnClick={false}
          />
          <BrowserRouter>
            <Navbar />
            {routes}
          </BrowserRouter>
        </AuthContext.Provider>
      </Provider>
    </>
  )
}

export default App