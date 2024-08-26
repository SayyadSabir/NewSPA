// src/shared/sharedStore.ts
import { createStore } from 'redux';

// Initial state
interface FormState {
    name: string;
    email: string;
}

const initialState: FormState = {
    name: 'TestName',
    email: 'TestEmail'
};

// Action types
const SET_NAME = 'SET_NAME';
const SET_EMAIL = 'SET_EMAIL';

// Action creators
export const setName = (name: string) => {
    console.log('Dispatching setName:', name);
    return {
      type: SET_NAME,
      payload: name
    };
  };

  export const setEmail = (email: string) => {
    console.log('Dispatching setEmail:', email);
    return {
      type: SET_EMAIL,
      payload: email
    };
  };

// Reducer function
function formReducer(state = initialState, action: any): FormState {
    console.log('Reducer received action:', action);
    switch (action.type) {
        case SET_NAME:
            return { ...state, name: action.payload };
        case SET_EMAIL:
            return { ...state, email: action.payload };
        default:
            return state;
    }
}

// Create the Redux store
const store = createStore(formReducer);

export default store;