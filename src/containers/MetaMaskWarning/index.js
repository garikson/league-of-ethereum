import html from 'dot-html';
import { connect } from 'react-redux';
import styled from 'dot-styled-components';
import Eth from 'ethjs';

import { selectEnvironment, selectAccountValid, selectAccountBalance } from 'containers/App/selectors';
import { loadAccount } from 'containers/App/actions';

const Wrapper = styled.div`
  border: 2px solid darkorange;
  padding: 20px;
  color: darkorange;
  width: 50%;
  margin: 0px auto;
  margin-bottom: 50px;
  margin-top: 20px;
  text-align: center;
  padding-bottom: 40px;
  display: ${props => (props.display ? 'block' : 'none')}
`;

function MetaMaskWarning(props) {
  const metaMaskWarning = !props.environment.isMetaMask;
  const networkWarning = props.environment.isMetaMask && (props.environment.network !== props.environment.selectedNetwork);
  const validAccountWarning = props.environment.isMetaMask && !props.validAccount;
  const balanceWarning = (new Eth.BN(props.accountBalance)).eq(new Eth.BN(0));

  return html`
    <Wrapper display=${metaMaskWarning || networkWarning || validAccountWarning || balanceWarning}>
      <h2>Network Problem</h2>
      ${validAccountWarning && props.environment.isInjected ? html`<div>
        Hmm, looks like no account is available, unlock your MetaMask then click "Refresh Accont".

        <br />
        <br />
        <br />

        <button className="btn btn-warning" onClick=${props.loadAccount}>Refresh Account</button>
      </div>` : ''}
      ${metaMaskWarning || !props.environment.isInjected ? html`<div>
        Hmm, looks like you dont have MetaMask installed. Please install MetaMask to run the new internet and BoardRoom.

        <br /><br /><br />

        <a class="btn btn-warning" target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
          <img src="/metamask.png" style="height: 22px; margin-right: 10px; display: inline-block;" class="img-responsive">
          Install MetaMask
        </a>

      </div>` : ''}
      ${networkWarning ? 'Hmm, looks like your on the wrong network. Please set your MetaMask to the `rinkeby` network and refresh the page.' : ''}
      ${!networkWarning && !metaMaskWarning && !validAccountWarning && balanceWarning ? `Hmm.. looks like you have no balance in your account. Please load your account with ${props.environment.network} ether and refresh the page.` : ''}
    </Wrapper>
  `;
}

function mapStateToProps(state) {
  return {
    accountBalance: selectAccountBalance(state),
    validAccount: selectAccountValid(state),
    environment: selectEnvironment(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAccount: () => dispatch(loadAccount()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaMaskWarning);
