import html from 'dot-html';
import styled, { presets } from 'dot-styled-components';
import { Component } from 'react';

import { connect } from 'react-redux';
import Eth from 'ethjs';
import { polyglot, localeTranslations } from 'i18n';

import {
  selectEnvironment,
  selectContributeInfo,
  selectTransaction,
  selectAccount,
  selectLeague,
} from 'containers/App/selectors';

import { contribute, transactionReset } from 'containers/App/actions';

import MetaMaskWarning from 'containers/MetaMaskWarning';
import Margin from 'components/Margin';
import Padding from 'components/Padding';
import EtherscanLink from 'components/EtherscanLink';

const Wrapper = styled.div`
  padding: 20px;
`;

const OuterWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 130px;
  right: 0px;
  bottom: 0px;
  padding-bottom: 100px;
  overflow: auto;
  overflow-x: hidden;
`;

const projects = {
  EWASM: {
    address: '0x4ae2b62cd128837df5b842625b19e4088a112a81', // '0x51434F6502b6167ABEC98Ff9F5fd37Ef3E07E7d2',
    leader: 'Martin Bezce (wanderer)',
    description: html`<span>Ewasm’s goal is to research and replace the EVM with Webassembly and secondarily, implement a client for the current system which can be efficiently JITed (or transcompiled) to WebAssembly.

      <br /><br />

      A major piece of evaluating WebAssembly for blockchain usage will be create a test network and this year the focus of the Ewasm team will be bringing that test network to life.
    </span>`,
    website: 'http://github.com/ewasm',
    websiteName: 'EWASM Github',
  },
  Truffle: {
    address: '0x',
    leader: 'Tim Coulter',
    website: 'http://truffleframework.com/',
    websiteName: 'truffleframework.com',
  },
  OpenZepplin: {
    address: '0xc897C412e533D8aAFC5e2f3F6Fe2e3fA46f72A45',
    leader: 'Manuel Araoz',
    website: 'https://openzeppelin.org/',
    websiteName: 'openzeppelin.org',
  },
  BoardRoom: {
    leader: 'Nick Dodson',
    website: 'https://boardroom.to',
    websiteName: 'boardroom.to',
  },
};

const membershipFee = '0.1';

function TransactionAlert(props) {
  return html`
    <div class="alert alert-info" style="margin-top: 20px;">
      <h3 style="margin-top: 10px;">Processing your contribution..</h3>
      <p>Your contribution is being transacted, this may take a minute or two..</p>
      <hr style="background-color: #FFF; border-color: #FFF;" />
      <p><a href="" style="color: #FFF;">View it on Etherscan</a></p>
    </div>
  `;
}

function ContributeAlertsComponent(props) {
  const alertClass = props.error ? 'warning' : (props.success ? 'success' : 'info'); // eslint-disable-line
  const alertMessage = (props.pending && !props.transactionHash ? 'Awaiting transaction approval..' : (   // eslint-disable-line
    (props.pending && props.transactionHash && !props.error && !props.success) ? 'Your transaction is being mined, this may take a minute or two...' : (   // eslint-disable-line
      props.error ? 'There was an error while contributing ' :             // eslint-disable-line
      (
        props.success ? 'Your contribution has been made!' : 'Your contribution is being made..'
      )
  )));

  return (props.pending || props.error || props.success) ? html`
    <Margin sm-top="20px">
      <div className="alert alert-${alertClass} text-left">
        <Padding sm-bottom="10px">
          <h3>${props.error ? 'Hmm.. There was a problem' : 'Contributing to project..'}</h3>
          <p>
            ${alertMessage}
          </p>
          ${props.transactionHash || props.error ? html`<span><hr /></span>` : ''}
          <div style="overflow-wrap: break-word;">
            ${props.error ? String(JSON.stringify(props.error, null, 2)) : ''}
          </div>
          ${props.transactionHash ? html`<EtherscanLink transactionHash=${props.transactionHash} light="true"></EtherscanLink>` : ''}
        </Padding>
      </div>
    </Margin>
  ` : html`<span></span>`;
}

function CreateAlertsMapStateToProps(state) {
  return selectTransaction(state, 'contribute');
}

const ContributeAlert = connect(CreateAlertsMapStateToProps, null)(ContributeAlertsComponent);

function ContributionModalComponent(props) {
  const { kind = 'EWASM', display = false, contributeModule, account = {}, contributeTransaction, contributeToProject, resetTransaciton } = props || {};
  const recipientAddress = projects[kind].address;
  const closeAndReset = () => {
    // if success or failure close dialog
    if (contributeTransaction.success || contributeTransaction.error) {
      resetTransaciton();
    }

    contributeModule.setState({ openContribute: false });
  };

  return html`<div class="modal" style="display: ${display ? 'block' : 'none'}; margin-top: 110px;">
    <div style="top: 0px; bottom: 0px; left: 0px; right: 0px; position: fixed; display: block; z-index: 11000; background: rgba(0,0,0,.5);" onClick=${closeAndReset}></div>
    <div class="modal-dialog" style=" z-index: 13000;">
      <div class="modal-content" style="max-height: 800px; overflow-y: auto;">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onClick=${closeAndReset}>x</button>
          <h4 class="modal-title">Contribute to ${kind}</h4>
        </div>

        <div class="model-body">
          <MetaMaskWarning></MetaMaskWarning>
        </div>

        <div class="modal-body show">
          <div class=${account.isMember ? 'hidden' : 'show'}>
            <p>You are currently not a member of the League of Ethereum, please contribute at least the minimum membership due below.</p>

            <p><b>Minimum membership due: ${membershipFee} ether</b></p>
          </div>

          <div class=${account.isMember ? 'show' : 'hidden'}>
            <p>Please enter the Ether amount you would like to contribute below.</p>
          </div>

          <br />

          <div class="form-group">
            <label class="control-label">Contribution Value</label>
            <div class="input-group">
            <input id="contributionValue" type="number" class="form-control" placeholder=${membershipFee} defaultValue=${membershipFee} />
              <span class="input-group-addon">ether</span>
            </div>
          </div>
        </div>


        <div class="modal-body hidden">
          <p>Please enter the address you want to use to contribute.</p>

          <br />

          <label>Member Address</label>

          <input id="membershipAddress" type="text" defaultValue="0x" class="form-control" />

          <br />
        </div>

        <div class="modal-footer">
          <br />

          <button type="button" class="btn btn-default" data-dismiss="modal" onClick=${closeAndReset}>Close</button>
          <button type="button" class="btn btn-success" onClick=${() => contributeToProject(
            account.address,
            recipientAddress,
            document.querySelector('#contributionValue').value, // eslint-disable-line
          )}>Contribute</button>

          <br /><br />

          <ContributeAlert></ContributeAlert>
        </div>
      </div>
    </div>
  </div>`;
}


function mapStateToPropsContributionModal(state) {
  return {
    environment: selectEnvironment(state),
    account: selectAccount(state),
    contirbuteInfo: selectContributeInfo(state),
    contributeTransaction: selectTransaction(state, 'contribute'),
  };
}

function mapDispatchToPropsContributionModal(dispatch) {
  return {
    contributeToProject: (contributorAddress, recipientAddress, etherValue) => dispatch(contribute(contributorAddress, recipientAddress, etherValue)),
    resetTransaciton: () => dispatch(transactionReset('contribute')),
  };
}

const ContributionModal = connect(mapStateToPropsContributionModal, mapDispatchToPropsContributionModal)(ContributionModalComponent);

function ProjectsButton(props) {
  const { name = '', selectedKind, contributeModule } = props || {};
  const selected = selectedKind === name;

  return html`
    <button onClick=${() => contributeModule.setState({ selectedKind: name })} className="col-xs-3 btn text-default compressed-header ${selected ? 'text-success' : ''} btn-lg" style="background-color: ${selected ? '#333' : '#222'}; ${selected ? '' : 'color: #FFF;'} text-decoration: none; padding: 80px; padding-left: 0px; padding-right: 0px;">

      <h2>${name} <br /> ${selected ? html`<div class="bg-success" style="height: 6px; width: 30%; margin: 0px auto; margin-top: 8px;"></div>` : ''}</h2>

    </button>
  `;
}

class StartView extends Component {

  render() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const league = props.league;
    const { openContribute = false, selectedKind = 'EWASM', readMore = false } = state || {};

    console.log(league);

    return html`
      <div>
          <div class="container text-center" style="padding-top: 150px;">

            <h1 class="text-center head-title shimmer"><b><span class="head-word">L</span>EAGUE <span style="font-size: 30px;">OF</span> <span class="head-word">E</span>THEREUM</b></h1>

            <br /><br />

            <h4 style="line-height: 40px; font-size: 25px;">
              Pay your dues to the LoE project you like, become a member
              <br />Vote on polls and new projects to support
              <br />Repreat later to keep your start date and earn tokens along the way
            </h4>

            <br /><br />

            <a href="#projects" data-no-routing class="btn btn-lg btn-outline">
              Contribute
            </a>

            <br />  <br /> <br />

            <a href="#loetokens" data-no-routing class="btn btn-lg btn-link text-success text-center" >
              Learn more <br />

              <img src="downward.png" style="width: 20px; margin-top: 20px; display: inline-block;" class="img-responsive" />
            </a>

             <br /><br />
          </div>

          <div class="jumbotron" style="background: #F1F1F1;">
            <div class="container">

              <div class="row">

                <div class="col-xs-4  text-center">
                  <h1><b class=" text-success">${league.totalMembers || 0}</b></h1>
                  <p>Members</p>
                </div>

                <div class="col-xs-4  text-center">
                  <h1><b>${league.totalTokenSupply || 0}</b></h1>
                  <p>(LoE) League Tokens</p>
                </div>

                <div class="col-xs-4 text-center">
                  <h1><b>${Eth.fromWei(league.totalEtherRaised || 0, 'ether').toString(10)}</b></h1>
                  <p>Ether Raised</p>
                </div>

              </div>
              <a name="projects"></a>
            </div>
          </div>

          <div class="container">

            <div class="text-center">

              <h2>Projects</h2>

              <p>League members pay dues to support the projects they choose</p>

               <br /><br />

            </div>

          </div>

          <div>

            <div class="container" style="background-color: #333;">

              <div class="row">

                <ProjectsButton name='EWASM' selectedKind=${selectedKind} contributeModule=${self}></ProjectsButton>
                <ProjectsButton name='Truffle' selectedKind=${selectedKind} contributeModule=${self}></ProjectsButton>
                <ProjectsButton name='OpenZepplin' selectedKind=${selectedKind} contributeModule=${self}></ProjectsButton>
                <ProjectsButton name='BoardRoom' selectedKind=${selectedKind} contributeModule=${self}></ProjectsButton>

              </div>

              <div style="color: #F1F1F1; padding: 75px;">

                <div class="row">

                  <div class="col-xs-4">

                    <img src="${selectedKind}.png" class="img-responsive" />

                  </div>

                  <div class="col-xs-8">

                    <p>
                      ${projects[selectedKind].description || 'No description.'}
                    </p>

                    <br />

                    <div class=${readMore ? 'show' : 'hidden'}>

                      <b>Leader </b> ${projects[selectedKind].leader || 'Unknown'}

                      <br /><br />

                      <b>Website </b> <a href=${projects[selectedKind].website || '#'} class="text-white" target="_blank">${projects[selectedKind].websiteName || 'No website found.'}</a>

                      <br /><br />
                    </div>

                    <button onClick=${() => self.setState({ readMore: !readMore })} class="btn btn-link text-success" style="padding: 0px;">
                      Read ${readMore ? 'less' : 'more'}
                    </button>


                    <br /><br />  <br /><br />

                    <button class="btn btn-lg btn-success" onClick=${() => self.setState({ openContribute: true })}>
                      Select for Contribution
                    </button>

                  </div>
                </div>

              </div>

            </div>

          </div>

            <a name="loetokens"></a>

          <div class="container">

            <div class="text-center">
              <br /><br />
                                     <br /><br />

              <h2>Legaue of Ethereum Tokens</h2>

              <br /><br />

              <p>League of Ethereum has a single token (LoE) which is used to mark contribution history and reputation within the league comumunity.
                In the future, the community may use these tokens as discount on membership dues or membership for new users.
                For now, the tokens are purley your reputation.</p>

               <br /><br />
                                      <br /><br />

            </div>

          </div>

            <a name="mission"></a>


          <div style="background-color: #F1F1F1;">
            <div class="container">

              <div class="text-center">
                <br /><br />

                <h2>Mission</h2>

                <br /><br />

                <p>We believe the Ethereum community is ready to organize in a way it has never done before.
                  A simple, membership DAO that can help aid in the funding of technical research and development for the Ethereum ecosystem.
                  League Of Ethereum will begin this project by launching an instantiation of the BoardRoom Lynx protocol with the club settings activated.
                  The structure will be tokanized and use a combination of registries and membership dues to fund a self organizing DAO.
                  The members can vote on specific projects, polling and fund allocation proposals that will help shape the organization and its cause.
                  The initial list is compiled from people we believe deserve broad based support from the community.
                  The tokens issued in a lynx DAO will act as reputation within the community, which can have significant benifit in the future as the project grows.</p>

                             <br /><br />
                 <br /><br />

              </div>

            </div>
          </div>


          <div class="container">

            <div class="text-center">
              <br /><br />

              <h2>See it on BoardRoom</h2>

              <br /><br />

              <p>Open the Leaugue of Ethereum DAO on BoardRoom where you can vote and interact with the LoE DAO.</p>

              <br /><br />  <br /><br />

              <button class="btn btn-lg btn-success">
                View on BoardRoom
              </button>

              <br /><br />  <br /><br />
            </div>

            <ContributionModal kind=${selectedKind} display=${openContribute} contributeModule=${self}></ContributionModal>

          </div>
      </div>
    `;
  }
}

function mapStateToPropsStartView(state) {
  return {
    league: selectLeague(state),
  };
}

function mapDispatchToProps(state) {
  return {};
}

export default connect(mapStateToPropsStartView, mapDispatchToProps)(StartView);

/*

export function mapStateToProps(state) {
  return {
    locale: selectLocale(state),
  };
}

export default connect(mapStateToProps)(App);

*/
