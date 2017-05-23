import html from 'dot-html';
import styled from 'dot-styled-components';
import { Component } from 'react';

import { connect } from 'react-redux';
import { selectBoardRulesKind } from 'containers/App/selectors';

import { t } from 'i18n';

function MembershipModal(props) {
  const { display = false } = props || {};

  return html`
    <div class=${display ? 'show' : 'hidden'} style="position: fixed; padding: 30px; box-shadow: 1px 1px 1px rgba(0,0,0,.1); padding-top: 0px; top: 89px; background: #FFF; z-index:1001; right: 25%; height: 300px; min-width: 650px; border: 1px solid #F1F1F1; border-top: 0px;">
      <h3>Membership</h3>
    </div>
  `;
}

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

        <MembershipModal display=${openMembership}></MembershipModal>
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
