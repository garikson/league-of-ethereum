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

  CONTRIBUTE,
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

  contributeInfo,
  leagueLoaded,

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

  LOAD_LEAGUE,

  selectEnvironment,
  selectAccount,
} from './selectors';

var injectedProvider = typeof window.web3 !== 'undefined' ? window.web3.currentProvider : null; // eslint-disable-line
const eth = new Eth(injectedProvider || (new Eth.HttpProvider('https://rinkeby.infura.io')));

const getTransactionSuccess = setupTxSuccess(eth);

const BoardRoomContract = eth.contract(JSON.parse(environments.contracts.BoardRoom.interface));
const RulesInterfaceContract = eth.contract(JSON.parse(environments.contracts.Rules.interface));
const LeagueRules = eth.contract(JSON.parse(environments.contracts.LeagueRules.interface));
const MiniMeToken = eth.contract(JSON.parse(environments.contracts.MiniMeToken.interface));

// Addresses
const leagueAddress = '0xd62510b0e12e76593d6c6a09bf40fce9fed708a2';
const tokenAddress = '0x07f2208f7408c27742e59cadeb10b46811ae348c';
const minimumFee = '0.1';


export const routerLogic = createLogic({
  type: 'LOCATION_CHANGE', // for some reason the LOCATION_CHANGE constant wont import
  latest: true,

  async process({ getState, action }, dispatch, done) { // eslint-disable-line
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

    // load leage info here as well
    try {
      const leageRulesInstance = LeagueRules.at(leagueAddress);
      const tokenInstance = MiniMeToken.at(tokenAddress);

      const decimals = new Eth.BN(10).pow((await tokenInstance.decimals())[0]);
      const totalSupply = (await tokenInstance.totalSupply())[0].div(decimals).toString(10);
      const totalMembers = (await leageRulesInstance.getContributorsLength())[0].toString(10);
      const totalEtherRaised = (await leageRulesInstance.total())[0].toString(10);

      // league information loaded
      dispatch(leagueLoaded(totalMembers, totalSupply, totalEtherRaised, decimals));
    } catch (error) {
      console.log(error);
    }
  },
});

export const loadAccountLogic = createLogic({
  type: LOAD_ACCOUNT,
  latest: true,

  async process({ action }, dispatch, done) { // eslint-disable-line
    try {
      const accountAddress = action.address || ((await eth.accounts()))[0];
      const leageRulesInstance = LeagueRules.at(leagueAddress);
      const tokenInstance = MiniMeToken.at(tokenAddress);

      dispatch(loadNetwork());

      if (accountAddress === '0x' || !accountAddress) {
        done();
        return;
      }

      const accountBalance = (await eth.getBalance(accountAddress));
      const decimals = new Eth.BN(10).pow((await tokenInstance.decimals())[0]);
      const tokenBalance = (await tokenInstance.balanceOf(accountAddress))[0].div(decimals).toString(10);
      const contributorInfo = await leageRulesInstance.contributors(accountAddress);
      const contributorExtensionInfo = await leageRulesInstance.getMaximumExtension(accountAddress);
      const membershipPeriod = (await leageRulesInstance.membershipPeriod())[0];
      const memberUntil = contributorExtensionInfo.until.add(new Eth.BN(60 * 60 * 24));

      dispatch(accountLoaded(accountAddress, accountBalance, true, contributorInfo, tokenBalance, contributorExtensionInfo, memberUntil));

      done();
    } catch (catchError) {
      console.log('Error while loading account: ', catchError); // eslint-disable-line
    }
  },
});

export const contributeLogic = createLogic({
  type: CONTRIBUTE,
  latest: true,

  async process({ action, getState }, dispatch, done) { // eslint-disable-line
    const transactionName = 'contribute';

    try {
      const contributorAddress = action.contributorAddress;
      const account = selectAccount(getState());
      const recipientAddress = action.recipientAddress;

      const minimumValueInWei = Eth.toWei(minimumFee, 'ether');
      const valueInWei = Eth.toWei(action.etherValue, 'ether');


      if (!Eth.isAddress(contributorAddress)) {
        dispatch(transactionError(transactionName, `Please use a valid Ethereum address to contribute with.`)); // eslint-disable-line
        return;
      }

      if (!Eth.isAddress(recipientAddress)) {
        dispatch(transactionError(transactionName, `Please use a valid Ethereum address to be the recipient address of the contribution.`)); // eslint-disable-line
        return;
      }

      if (!account.valid) {
        dispatch(transactionError(transactionName, `No account injected. Please make sure MetaMask is working and you have unlocked your MetaMask account.`)); // eslint-disable-line
        return;
      }

      if (!account.isMember && valueInWei.lt(minimumValueInWei)) {
        dispatch(transactionError(transactionName, `You must select a vaue greater than the minimum due payment of ${minimumFee} ether.`)); // eslint-disable-line
        return;
      }


      const defaultTxObject = Object.assign({
        from: contributorAddress,
        gas: 3000000,
        value: valueInWei,
      });
      const leageRulesInstance = LeagueRules.at(leagueAddress);

      // contribute method abi
      // const contributeMethodAbi = leageRulesInstance.abi.filter(v => v.name === 'contributeFor')[0];

      // const contributeMethodInputs = [contributorAddress, recipientAddress];
      // const bytecode = Eth.abi.encodeMethod(contributeMethodAbi, contributeMethodInputs);

      const isMetaMask = selectEnvironment(getState()).isMetaMask;

      // transaction flow if metamask
      dispatch(transactionRequest(transactionName, [contributorAddress, recipientAddress]));

      const contributeTxHash = await leageRulesInstance.contributeFor(contributorAddress, recipientAddress, defaultTxObject);

      dispatch(transactionPending(transactionName, contributeTxHash));

      const contributionReceipt = await getTransactionSuccess(contributeTxHash);

      // throw error if thrown
      if (contributionReceipt.logs.length === 0) {
        dispatch(transactionError(transactionName, `There was an error while making this transaction.. please try again.`)); // eslint-disable-line
        return;
      }

      dispatch(transactionSuccess(transactionName, {}));
      dispatch(loadNetwork());
      dispatch(loadAccount());
    } catch (catchError) {
      dispatch(transactionError(transactionName, `error while transacting: ${catchError.message} ${catchError.value}`));
    }
  },
});
