import html from 'dot-html';
import styled from 'dot-styled-components';

import { connect } from 'store';
import { selectCurrentTime } from './selectors';

export const Wrapper = styled.div`
  padding: 0px;
`;

function Time(props) {
  return html`<Wrapper props=${props}>
    ${(new Date(props.current * 1000)).toISOString()}
  </Wrapper>`;
}

export function mapStateToProps(state) {
  return {
    current: selectCurrentTime(state),
  };
}

export default connect(mapStateToProps)(Time);
