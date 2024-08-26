import { combineReducers } from 'redux';

// Example reducer
const detailsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'SAVE_DETAILS':
      return { ...state, details: action.payload };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  details: detailsReducer,
  // Add more reducers as needed
});
