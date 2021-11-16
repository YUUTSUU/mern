import React from 'react'
import {Switch, Route, Redirect} from "react-router-dom"
import Main from "../components/main/main"
import Account from '../components/account/account'
import Login from "../components/login/login"
import Register from "../components/register/register"
import Activation from '../components/activation/activation'

const NotFound = () => {
  return (
    <>
      <div className="container">
        <h3>404</h3>
      </div>
    </>
  )
}

export const useRoutes = (isAuthentication) => {
  if (isAuthentication) {
    return (
      <Switch>
        <Route path="/account" exact component={Account} />
        <Redirect to="/account" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/activation" exact component={Activation} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="*" component={NotFound} status={404} />
    </Switch>
  )
}