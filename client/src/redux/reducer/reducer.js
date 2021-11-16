const DefaultRootState = {
  input: ""
}

export const rootReducer = (state = DefaultRootState, action) => {
  switch (action.type) {
    case "TEXT":
      return {...state, [action.payload.target.name]: action.payload.target.value}
    default:
      return state
  }
}

