// sharedStore.ts
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

console.log("Shared module 'mfe_store/sharedStore' is loaded eagerly.");
// Initial state

const initialState = {
  name: '',
  email: ''
};

// Action types
const SET_NAME = 'SET_NAME';
const SET_EMAIL = 'SET_EMAIL';

// Action creators
export const setName = (name) => {
  console.log('Dispatching setName:', name);
  return {
    type: SET_NAME,
    payload: name
  };
};

export const setEmail = (email) => ({
  
  type: SET_EMAIL,
  payload: email
});

// Reducer function
function formReducer(state = initialState, action) {
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



export function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}