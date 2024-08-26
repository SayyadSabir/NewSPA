import { combineEpics } from 'redux-observable';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

// Example epic
const saveDetailsEpic = (action$: any) =>
  action$.pipe(
    ofType('SAVE_DETAILS'),
    map((action: { payload: any }) => ({
      type: 'DETAILS_SAVED_SUCCESSFULLY',
      payload: action.payload
    }))
  );

export const rootEpic = combineEpics(
  saveDetailsEpic
  // Add more epics as needed
);
