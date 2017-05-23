import html from 'dot-html';
import { connect } from 'react-redux';
import styled from 'dot-styled-components';

import { selectEnvironment, selectAccountValid } from 'containers/App/selectors';

const Wrapper = styled.div`
  border: 2px solid darkorange;
  padding: 20px;
  color: darkorange;
  width: 50%;
  margin: 0px auto;
  margin-bottom: 50px;
  text-align: center;
  padding-bottom: 40px;
  display: ${props => (props.display ? 'block' : 'none')}
`;

function MetaMaskWarning(props) {
  const metaMaskWarning = !props.environment.isMetaMask;
  const networkWarning = props.environment.network !== props.environment.selectedNetwork;
  const validAccountWarning = !props.validAccount;

  return html`
    <Wrapper display=${metaMaskWarning || networkWarning || validAccountWarning}>
      <h2>Network Problem</h2>
      ${validAccountWarning && props.environment.isInjected ? 'Hmm, looks like no account is available, unlock your MetaMask then refresh the page.' : ''}
      ${metaMaskWarning || !props.environment.isInjected ? html`<div>
        Hmm, looks like you dont have MetaMask installed. Please install MetaMask to run the new internet and BoardRoom.

        <br /><br /><br />

        <a class="btn btn-warning" target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
          <img src="/metamask2.png" style="height: 22px; margin-right: 10px; display: inline-block;" class="img-responsive">
          Install MetaMask
        </a>

      </div>` : ''}
      ${networkWarning ? 'Hmm, looks like your on the wrong network. Please set your MetaMask to the `rinkeby` network and refresh the page.' : ''}
    </Wrapper>
  `;
}

function mapStateToProps(state) {
  return {
    validAccount: selectAccountValid(state),
    environment: selectEnvironment(state),
  };
}

export default connect(mapStateToProps, null)(MetaMaskWarning);
