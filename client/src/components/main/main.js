// import React, {createRef, useEffect} from 'react'
import "./main.scss"

// import {actionCreaters} from '../../redux/action/action'
// import {useDispatch, useSelector} from 'react-redux'


const Main = () => {
  // const dispatch = useDispatch()
  // const {value} = useSelector(state => state)

  // const ref = createRef()

  // useEffect(() => {
  //   console.log(ref.current)
  //   ref.current.focus()
  // }, [ref])

  return (
    <>
      <div className="container">
        <div className="main">
          <h5>Здесь будет главная страница</h5>
          <br />
          {/* <button className="mt-2 btn green" onClick={(event) => setState(event)} >INC</button> */}
          {/* <input ref={ref} value={value} name="input" onChange={(event) => dispatch(actionCreaters(event))} /> */}
          <br />
          {/* <span>{value}</span> */}
        </div>
      </div>
    </>
  )
}

export default Main