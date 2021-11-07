const initialState = {
  text: ""
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORM":
      return {
        text: action.payload
      }
    default:
      return state
  }
}

export default reducer