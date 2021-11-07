import React from 'react'
import "./main.scss"
import {useDispatch, useSelector} from 'react-redux'
import {handler} from "../../redux/action/action"
import {connect} from "react-redux"

const Main = () => {
  const dispatch = useDispatch()
  const text = useSelector(state => state)
  return (
    <>
      <div className="container">
        <div className="main">
          <button className="mt-2 btn" onClick={() => dispatch(handler)}>onClick</button>
          <div>{text}</div>
        </div>
      </div>
    </>
  );
}

export default connect(Main)