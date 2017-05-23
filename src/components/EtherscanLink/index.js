import html from 'dot-html';

import { connect } from 'react-redux';

export function EtherscanLinkComponent({
  address = null,
  transactionHash = null,
  text = 'view it on etherscan',
  light = false,
  selectedNetwork,
}) {
  return (address || transactionHash) ? html`
    <a href="https://${selectedNetwork}.etherscan.io/${address ? 'address' : 'tx'}/${address || transactionHash}" target="_blank" style=${light ? 'color: #FFF;' : 'color: #000;'}>
      ${text}
    </a>
  ` : '';
}

function mapStateToProps(state) {
  return {
    selectedNetwork: state.environment.selectedNetwork,
  };
}

export default connect(mapStateToProps, null)(EtherscanLinkComponent);
