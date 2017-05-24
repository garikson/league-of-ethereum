import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';

import togglesReducer from 'containers/Toggle/reducers';
import timeReducer from 'containers/Time/reducer';
import {
  boardReducer,
  accountReducer,
  transactionsReducer,
  environmentReducer,
  leagueReducer,
} from 'containers/App/reducer';

// i18n state
const languageState = Immutable({
  locale: 'en',
});

function languageReducer(state = languageState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case 'LOCALE_CHANGE':
      return state.merge({
        locale: action.locale,
      });
    default:
      return state;
  }
}

// Initial routing state
const routeInitialState = Immutable({
  location: document.location.pathname, // eslint-disable-line
});

function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case 'LOCATION_CHANGE':
      return state.merge({
        location: action.location,
      });
    default:
      return state;
  }
}

export function createReducer(asyncReducers) { // eslint-disable-line
  return combineReducers({
    environment: environmentReducer,
    transactions: transactionsReducer,
    account: accountReducer,
    board: boardReducer,
    league: leagueReducer,
    language: languageReducer,
    route: routeReducer,
    time: timeReducer,
    ...asyncReducers,
  });
}
