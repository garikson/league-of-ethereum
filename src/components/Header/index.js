import html from 'dot-html';
import styled from 'dot-styled-components';
import { Component } from 'react';

import { connect } from 'react-redux';
import { selectBoardRulesKind, selectAccount, selectEnvironment } from 'containers/App/selectors';
import { loadAccount } from 'containers/App/actions';
import fecha from 'fecha';
import fromnow from 'moment-from-now';

import { t } from 'i18n';

function displayDate(unixtimestamp, withTime) {
  return fecha.format(new Date(parseInt(unixtimestamp || 0, 10) * 1000), 'mediumDate');
}

function fromNow(unixtimestamp) {
  return fromnow(parseInt(unixtimestamp, 10) * 1000 || 0);
}

function MembershipModalComponent(props) {
  const { display = false, headerComponent, loadAccountInfo, account } = props || {};

  return html`
    <div>

      <div class=${display ? 'show' : 'hidden'} style="position: fixed; padding: 30px; box-shadow: 1px 1px 1px rgba(0,0,0,.1); padding-top: 0px; top: 89px; background: #FFF; z-index:1001; right: 18%; min-height: 300px; min-width: 650px; border: 1px solid #F1F1F1; border-top: 0px;">

        <h3>Membership</h3>

        <div className=${account.isMember ? 'show' : 'hidden'}>


          <div class="row">
            <br /><br />

            <div class="col-xs-4">

                <h4>Balance</h4>
                <h3 class="text-info"><b>${account.tokenBalance}</b> (LoE) tokens</h3>

            </div>
            <div class="col-xs-4">

                <h4>Start Date</h4>
                <h3>${displayDate(account.joinedAt)} <br /> <small>(${fromNow(account.joinedAt)})</small></h3>

            </div>
            <div class="col-xs-4">

                <h4>Next Payment Due</h4>
                <h3>${displayDate(account.memberUntil, true)} <br /></h3>

            </div>
          </div>


          <hr />


          <br />


          <div class="text-right">
            <button class="btn btn-default" onClick=${() => headerComponent.setState({ openMembership: false })}>Close</button>
          </div>

        </div>



        <div className=${account.isMember ? 'hidden' : 'show'}>

          <p>To view your membership, please enter your Ethereum address</p>

          <br /><br />

          <label class="control-label">Address</label>
          <div class="input-group" style="width: 600px;">
            <input id="memberAddress" type="text" className="form-control" defaultValue="" placeholder="0x" />
            <span class="input-group-btn">
              <button class="btn btn-warning" onClick=${() => loadAccountInfo()}>Use MetaMask</button>
            </span>
          </div>

          <br /><br />

          <div class="text-right">
            <button class="btn btn-default" onClick=${() => headerComponent.setState({ openMembership: false })}>Close</button>
            <button class="btn btn-success" onClick=${() => loadAccountInfo(
              document.querySelector('#memberAddress').value, // eslint-disable-line
            )}>View Membership</button>
          </div>

        </div>

        <div class="clearfix"></div>
      </div>

      <div class=${display ? 'show' : 'hidden'} onClick=${() => headerComponent.setState({ openMembership: false })} style="position: fixed; top: 89px; left: 0px; right: 0px; bottom: 0px; z-index: 500;"></div>

    </div>
  `;
}

function mapStateToPropsModal(state) {
  return {
    account: selectAccount(state),
    environment: selectEnvironment(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAccountInfo: address => dispatch(loadAccount(address)),
  };
}

const MembershipModal = connect(mapStateToPropsModal, mapDispatchToProps)(MembershipModalComponent);

class Header extends Component {
  componentWillMount() {
    const self = this;
    window.addEventListener('mousewheel', () => self.setState({ selectedButton: null })); // eslint-disable-line
  }

  render() {
    const self = this;
    const props = self.props;
    const { selectedButton = null, openMembership = false } = self.state || {};
    const isSelected = selector => (selector === selectedButton ? 'text-underline active' : '');

    return html`
      <div  style="padding-top: 20px; position: fixed; top: 0px; left: 0px; right: 0px; height: 90px; background: #FFF; z-index: 1000; border-bottom: 1px solid #F1F1F1;">
        <div class="container">
          <a href="https://boardroom-slack.herokuapp.com/" target="_blank" class="btn btn-link pull-left text-black">
            <img src="slack.png" style="width: 20px; display: inline-block; margin-right: 10px;" class="img-responsive" /> Slack
          </a>

          <button href="https://app.boardroom.to" target="_blank" class="btn btn-link pull-right" >
            <img src="boardroom-icon.png" style="width: 20px; display: inline-block;" class="img-responsive" />
          </button>

          <a href="#projects" onClick=${() => self.setState({ openMembership: false, selectedButton: 'joinus' })} data-no-routing className="btn btn-outline pull-right ${isSelected('joinus')}">
            Join Us</a>

          <button  onClick=${() => self.setState({ openMembership: !openMembership, selectedButton: 'membership' })} data-no-routing className="btn btn-link text-black pull-right ${isSelected('membership')}">
            Membership</button>

          <a href="#loetokens" onClick=${() => self.setState({ openMembership: false, selectedButton: 'loetokens' })} data-no-routing   className="btn btn-link text-black pull-right ${isSelected('loetokens')}">
            LoE Tokens</a>

          <a href="#projects" onClick=${() => self.setState({ openMembership: false, selectedButton: 'projects' })} data-no-routing className="btn btn-link text-black pull-right ${isSelected('projects')}">
            Projects</a>

          <a href="#mission" onClick=${() => self.setState({ openMembership: false, selectedButton: 'mission' })} data-no-routing  className="btn btn-link text-black pull-right ${isSelected('mission')}">
            Mission</a>
        </div>

        <MembershipModal display=${openMembership} headerComponent=${self}></MembershipModal>
      </div>
    `;
  }
}

function mapStateToProps(state) {
  return {
    rulesKind: selectBoardRulesKind(state),
  };
}

export default connect(mapStateToProps, null)(Header);
