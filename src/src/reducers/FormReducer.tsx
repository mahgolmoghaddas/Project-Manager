import { State, Action } from "../types";

export const initialState: State = { forms: [], data: [] };

export const reducer = (state: State, action: Action): State => {
  console.log(`Reducer Action: ${action.type}`, action);

  switch (action.type) {
    case "SET_FORMS":
      return { ...state, forms: action.payload };

    case "SET_DATA":
        return { ...state, data: action.payload };

    case "ADD_DATA":
      return { ...state, data: [...state.data, action.payload] };

    case "DELETE_DATA":
      return { ...state, data: state.data.filter((entry) => entry.id !== action.payload) };

    case "EDIT_DATA":
      return {
        ...state,
        data: state.data.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };

    case "EDIT_TAG":
      return {
        ...state,
        forms: state.forms.map((form) =>
          form.id === action.payload.formId
            ? {
                ...form,
                tags: form.tags.map((tag) =>
                  tag.name === action.payload.updatedTag.name ? action.payload.updatedTag : tag
                ),
              }
            : form
        ),
      };

    // case "SET_DATA":
    //     return { ...state, data: action.payload };
    default:
      return state;
  }
};
