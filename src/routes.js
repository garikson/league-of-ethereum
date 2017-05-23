import { Component } from 'react';
import { connect } from 'react-redux';

import sheetRouter from 'sheet-router';
import href from 'sheet-router/href';
import past from 'sheet-router/history';
import hash from 'sheet-router/hash';

import html from 'dot-html';

import styled from 'dot-styled-components';

import App from 'containers/App';
import NotFound from 'components/NotFound';
import StartView from 'containers/StartView';

export const router = sheetRouter({ default: '/404' }, [ // eslint-disable-line
  ['/', () => html`<StartView></StartView>`],
  ['/404', () => html`<NotFound></NotFound>`],
]);

let changeRouterState = () => {};

export const LOCATION_CHANGE = 'LOCATION_CHANGE';

export function changeLocation(location) {
  // change router state
  changeRouterState(location);

  // change browser history
  history.pushState({}, null, location); // eslint-disable-line

  // return redux action
  return {
    type: LOCATION_CHANGE,
    location,
  };
}

export class Router extends Component { // eslint-disable-line
  componentWillMount() {
    const self = this;

    const { dispatch = () => {} } = self.props.store || {};
    const currentLocation = (self.state || {}).location || (self.props.defaultLocation || ''); // eslint-disable-line

    changeRouterState = location => self.setState({ location });

      hash(location => dispatch(changeLocation(location.pathname))); // eslint-disable-line
    href(location => dispatch(changeLocation(location.pathname))); // eslint-disable-line
    past(location => dispatch(changeLocation(location.pathname))); // eslint-disable-line
  }

  render() {
    const self = this;
    const currentLocation = (self.state || {}).location || (self.props.defaultLocation || ''); // eslint-disable-line

    return html`<App>${router(currentLocation)}</App>`;
  }
}
