import React from 'react'
import "./main.scss"

import {actionCreaters} from '../../redux/action/action'
import {useDispatch, useSelector} from 'react-redux'


const Main = () => {
  const dispatch = useDispatch()
  const value = useSelector(state => state.input)

  console.log(value)

  return (
    <>
      <div className="container">
        <div className="main">
          <br />
          {/* <button className="mt-2 btn green" onClick={(event) => setState(event)} >INC</button> */}
          <input name="input" onChange={(event) => dispatch(actionCreaters(event))} />
          <br />
          <span>{value}</span>
        </div>
      </div>
    </>
  )
}

export default Main