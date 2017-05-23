import { createLogic } from 'dot-logic';
import Eth from 'ethjs';
import bnToString from 'utils/bnToString';
import { getItem, setItem } from 'utils/localStore';

import environments from 'contracts/lib/environments.json';
import setupTxSuccess from 'utils/getTransactionSuccess';
import { changeLocation, LOCATION_CHANGE } from 'routes';

import {
  LOAD_BOARD,
  CANCEL_BOARD_LOADING,
  CREATE_BOARD,

  LOAD_PROPOSAL,
  CANCEL_PROPOSAL_LOADING,

  NEW_PROPOSAL,
  CANCEL_NEW_PROPOSAL,

  LOAD_ACCOUNT,

  VOTE,
  VOTE_ERROR,

  EXECUTE,
  RULES_TRANSACTION,

  LOAD_NETWORK,
} from './constants';

import {
  boardLoaded,
  cancelBoardLoading,
  boardDiscovered,

  loadProposal,
  cancelProposalLoading,
  proposalLoaded,
  clearProposals,

  cancelNewProposal,
  proposalCreated,
  newProposalError,
  newProposalTransacitonCreated,

  selectCurrentProposal,

  proposalCount,
  recentVotersLoaded,

  accountLoaded,

  voteTx,
  voteError,
  voteCast,

  executeTx,
  executeSuccess,
  executeError,

  transactionRequest,
  transactionPending,
  transactionError,
  transactionSuccess,

  updateProposalCounts,

  networkLoaded,
  loadNetwork,
  loadAccount,
  loadBoard,

} from './actions';
import {
  selectBoardAddress,
  selectBoardRules,

  selectAccountAddress,
  selectAccountBalance,
  selectAccountValid,

  selectedProposal,
  selectProposalCount,

  selectRulesSpecification,
  selectProposals,
  selectRoute,

  selectRulesFactory,
  selectRulesFactoryCreationMethod,
  selectRulesFactoryCreationEvent,
  selectRulesFactoryCreationEventInput,

} from './selectors';

var injectedProvider = typeof window.web3 !== 'undefined' ? window.web3.currentProvider : null; // eslint-disable-line
const eth = new Eth(injectedProvider || (new Eth.HttpProvider('https://rinkeby.infura.io')));

const getTransactionSuccess = setupTxSuccess(eth);

const BoardRoomContract = eth.contract(JSON.parse(environments.contracts.BoardRoom.interface));
const RulesInterfaceContract = eth.contract(JSON.parse(environments.contracts.Rules.interface));

export const routerLogic = createLogic({
  type: 'LOCATION_CHANGE', // for some reason the LOCATION_CHANGE constant wont import
  latest: true,

  async process({ getState, action }, dispatch, done) { // eslint-disable-line
    if (['/', '/start'].indexOf(action.location) === -1
      && ((selectBoardAddress(getState()) === '0x' && !getItem('recentBoard')))) { //  || selectBoardRules(getState()) === '0x'
      console.log('go to start!');

      dispatch(changeLocation('/start'));
    }
  },
});


export const loadNetworkLogic = createLogic({
  type: LOAD_NETWORK,
  latest: true,

  async process({ action, getState }, dispatch, done) { // eslint-disable-line
    const providerInjected = (window.web3 || {}).currentProvider ? true : false; // eslint-disable-line
    const providerMetaMask = ((window.web3 || {}).currentProvider || {}).isMetaMask ? true : false; // eslint-disable-line
    const networkVersion = await eth.net_version();
    const networkName = ({ 1: 'mainnet', 4: 'rinkeby', 3: 'ropsten' })[networkVersion] || 'unknown';
    const selectedNetwork = getState().selectedNetwork; // should be a selector

    dispatch(networkLoaded(networkName, providerMetaMask, networkVersion, providerInjected));
  },
});

export const loadAccountLogic = createLogic({
  type: LOAD_ACCOUNT,
  latest: true,

  async process({ action }, dispatch, done) { // eslint-disable-line
    try {
      const accountAddress = ((await eth.accounts()))[0];

      dispatch(loadNetwork());

      if (accountAddress === '0x' || !accountAddress) {
        done();
        return;
      }

      const accountBalance = (await eth.getBalance(accountAddress));

      dispatch(accountLoaded(accountAddress, accountBalance, true));

      done();
    } catch (catchError) {
      console.log('Error while loading account: ', catchError); // eslint-disable-line
    }
  },
});
