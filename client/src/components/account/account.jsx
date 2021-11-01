import React, { useState, useContext, useEffect, useCallback } from 'react'
import { AuthContext } from '../../context/authContext'
import { useForm } from "../../hooks/form.hook"
import Loading from "../loading/loading"
import { toast } from 'react-toastify'
import axios from 'axios'
import "./account.scss"

const Account = () => {
  const { userId } = useContext(AuthContext)
  const { loading, setLoading } = useForm()
  const [ text, setText ] = useState("")
  const [ todos, setTodos ] = useState([])
  const [ updateText, setUpdateText ] = useState("")
  const [ ready, setReady ] = useState(false)

  const handlerChange = (event) => {
    setText(event.target.value)
  }

  const updateTextHandler = (event) => {
    setUpdateText(event.target.value)
  }

  const getTodo = useCallback(async () => {
    try {
      if (userId) {
        const response = await axios.get(`/api/posts/${ userId }`)
        setTodos(response.data)
        setTimeout(() => setReady(true), 500)
      }
    } catch (error) {
      console.log(error.message)
      if (error && error.response.data) console.log(error.response.data)
    }
  }, [ userId ])

  const createTodo = async (event) => {
    event.preventDefault()
    try {
      if (!text) return toast.warning("Заполните форму!")
      setLoading(true)
      await axios.post(`/api/posts/post`, { text, userId })
      setText("")
      setLoading(false)
      getTodo()
      toast.success("Запись создана!")
    } catch (error) {
      setLoading(false)
      console.log(error.message)
    }
  }


  // const Undo = ({ onUndo, closeToast }) => {
  //   const handleClick = () => {
  //     onUndo();
  //     closeToast();
  //   };

  //   return (
  //     <div>
  //       <span>"Запись удалена!"</span> <button onClick={ handleClick }>Отменить</button>
  //     </div>
  //   );
  // };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`/api/posts/delete/${ id }`)
      getTodo()
      toast.error("Запись удалена!")

      // toast(<Undo onUndo={ () => getTodo() } />,
      //   {
      //     onClose: async () => {
      //       await axios.delete(`/api/posts/delete/${ id }`)
      //       getTodo()
      //     }
      //   })
    } catch (error) {
      console.log(error.message)
    }
  }

  const importantTodo = async (id) => {
    try {
      await axios.put(`/api/posts/important/${ id }`)
      getTodo()
    } catch (error) {
      console.log(error.message)
    }
  }

  const editTodo = (id) => {
    const index = todos.findIndex(item => item._id === id)
    const item = { ...todos[ index ], edit: !todos[ index ].edit }
    const newTodos = [ ...todos.slice(0, index), item, ...todos.slice(index + 1) ]
    setTodos(newTodos)
  }

  const saveTodo = async (id) => {
    try {
      if (!updateText) return editTodo(id)
      await axios.put(`/api/posts/text/${ id }`, { updateText })
      setUpdateText("")
      getTodo()
      toast.success("Запись сохранена!")
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getTodo()
  }, [ getTodo ])

  return (
    <>
      <div className="container">
        <div className="main-page">
          <h4>Добавить задачу</h4>
          <form className="form form-login">
            <div className="form-input input-field">
              <input
                id="text"
                type="text"
                name="input"
                className="validate"
                onChange={ handlerChange }
                value={ text }
              />
              <label htmlFor="text">Задача</label>
            </div>
            <div className="form-buttons">
              <button
                type="submit"
                className="waves-effect waves-light btn blue form-btn"
                disabled={ loading }
                onClick={ createTodo }
              >Добавить</button>
            </div>
          </form>

          <h4>Активные задачи</h4>
          <ul className=" todos-list">
            {
              !ready ?
                <div className="loading-account">
                  <Loading />
                </div>
                : todos.map(item => {
                  let className = "todos-item";

                  if (item.important) {
                    className += " important"
                  }

                  return (
                    <li className={ className } key={ item._id }>
                      <div className="todos-label">
                        {
                          !item.edit
                            ? <span className="todos-description">{ item.text }</span>
                            : <input
                              className="todos-description"
                              type="text"
                              onChange={ updateTextHandler }
                              defaultValue={ item.text }
                            />
                        }
                      </div>
                      <div className="todos-buttons">
                        {
                          !item.edit
                            ? <button
                              className="waves-effect waves-light btn-floating yellow btn-small"
                              onClick={ () => editTodo(item._id) }>
                              <i className="material-icons todos-icons">edit</i>
                            </button>
                            : <button
                              className="waves-effect waves-light btn-floating green btn-small"
                              onClick={ () => saveTodo(item._id) }>
                              <i className="material-icons todos-icons">check</i>
                            </button>
                        }
                        {
                          !item.important
                            ? <button
                              className="waves-effect waves-light btn-floating blue btn-small"
                              onClick={ () => importantTodo(item._id) }>
                              <i className="material-icons todos-icons">grade</i>
                            </button>
                            : <button
                              className="waves-effect waves-light btn-floating orange btn-small"
                              onClick={ () => importantTodo(item._id) }>
                              <i className="material-icons todos-icons">grade</i>
                            </button>
                        }
                        <button
                          className="waves-effect waves-light btn-floating red btn-small"
                          onClick={ () => removeTodo(item._id) }>
                          <i className="material-icons todos-icons">clear</i>
                        </button>
                      </div>
                    </li>
                  )
                })
            }
          </ul>
        </div>
      </div>
    </>
  );
}

export default Account



