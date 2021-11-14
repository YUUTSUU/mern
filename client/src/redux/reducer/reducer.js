const initialState = {
  input: ""
}

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TEXT":
      return {...state, [action.payload.target.name]: action.payload.target.value}
    default:
      return state
  }
}