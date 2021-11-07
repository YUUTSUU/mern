import {useState, useCallback} from "react";

export const useForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name: "", email: "", password: ""});

  const handlerChange = useCallback((event) => {
    setForm({...form, [event.target.name]: event.target.value});
  }, [form, setForm])

  const clearForm = useCallback(() => {
    setForm({name: "", email: "", password: ""});
  }, [])

  return {loading, setLoading, form, clearForm, handlerChange};
}