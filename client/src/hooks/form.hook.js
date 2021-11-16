import {useState} from "react"

export const useForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name: "", email: "", password: ""})

  const formHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const clearForm = () => {
    setForm({...form, name: "", email: "", password: ""})
  }

  return {loading, setLoading, form, formHandler, clearForm}
}