import html from 'dot-html';
import styled, { css } from 'dot-styled-components';

import { connect } from 'store';
import { selectToggleStatus } from './selectors';
import { OPEN_STATUS } from './constants';

export const ToggleClass = css`
  display: ${props => (props.status === OPEN_STATUS ? 'inline-block' : 'none')};
`;

export const Wrapper = styled.div`
  ${ToggleClass}
`;

function Toggle(props) {
  return html`<Wrapper props=${props}>
    ${props.children}
  </Wrapper>`;
}

export function mapStateToProps(state, props) {
  return {
    status: selectToggleStatus(state, props),
  };
}

export default connect(mapStateToProps)(Toggle);
