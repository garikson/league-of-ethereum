import Eth from 'ethjs';
import { getItem, setItem } from 'utils/localStore';
import {
  LOAD_BOARD,
  BOARD_LOADED,
  CANCEL_BOARD_LOADING,
  BOARD_DISCOVERED,
  CREATE_BOARD,

  LOAD_PROPOSAL,
  PROPOSAL_LOADED,
  CANCEL_PROPOSAL_LOADING,
  SELECT_PROPOSAL,
  CLEAR_PROPOSALS,
  PROPOSAL_RECENT_VOTERS,

  NEW_PROPOSAL,
  PROPOSAL_CREATED,
  CANCEL_NEW_PROPOSAL,
  NEW_PROPOSAL_ERROR,
  NEW_PROPOSAL_TX,

  LOAD_ACCOUNT,
  ACCOUNT_LOADED,

  VOTE,
  VOTE_CAST,
  VOTE_ERROR,
  VOTE_TX,

  EXECUTE,
  EXECUTE_ERROR,
  EXECUTE_TX,
  EXECUTE_SUCCESS,

  PROPOSAL_COUNT,

  TRANSACTION_REQUEST,
  TRANSACTION_PENDING,
  TRANSACTION_ERROR,
  TRANSACTION_SUCCESS,

  RULES_TRANSACTION,
  PROPOSAL_COUNTS,

  LOAD_NETWORK,
  NETWORK_LOADED,

  CONTRIBUTE,
  CONTRIBUTE_INFO,
  TRANSACTION_RESET,

  LEAGUE_LOADED,
  LOAD_LEAGUE,
} from './constants';

// contribute methods
export function contribute(contributorAddress, recipientAddress, etherValue) {
  return {
    type: CONTRIBUTE,
    contributorAddress,
    recipientAddress,
    etherValue,
  };
}

export function contributeInfo(to, value, gas, data) {
  return {
    type: CONTRIBUTE_INFO,
    to,
    value,
    gas,
    data,
  };
}

export function loadLeague() {
  return {
    type: LOAD_LEAGUE,
  };
}

export function leagueLoaded(totalMembers, totalSupply, totalEtherRaised) {
  return {
    type: LEAGUE_LOADED,
    totalMembers,
    totalSupply,
    totalEtherRaised,
  };
}


// transaction actions
// adds to the list of known boards
export function boardDiscovered(address) {
  if (Eth.isHexString(address, 20)) {
    const knownBoards = getItem('boards') || {}; // getItem('boards'); // eslint-disable-line
    setItem('boards', Object.assign({}, knownBoards, { [address]: true })); // eslint-disable-line
  }

  return {
    type: BOARD_DISCOVERED,
    address,
  };
}

export function loadNetwork(rulesName, inputs) {
  return {
    type: LOAD_NETWORK,
  };
}

export function networkLoaded(network, isMetaMask, version, isInjected) {
  return {
    type: NETWORK_LOADED,
    network,
    version,
    isMetaMask,
    isInjected,
  };
}

export function createBoard(rulesName, inputs) {
  return {
    type: CREATE_BOARD,
    rules: rulesName,
    inputs,
  };
}

export function updateProposalCounts(counts) {
  return {
    type: PROPOSAL_COUNTS,
    counts,
  };
}


// rules transactions
export function rulesTransaction(abi, inputs, value) {
  return {
    type: RULES_TRANSACTION,
    abi, // method abi
    inputs, // inputs for method
    value,
  };
}


// transaction actions
export function transactionRequest(name, inputs) {
  return {
    type: TRANSACTION_REQUEST,
    name,
    inputs,
  };
}

export function transactionPending(name, transactionHash) {
  return {
    type: TRANSACTION_PENDING,
    name,
    transactionHash,
  };
}

export function transactionError(name, error) {
  return {
    type: TRANSACTION_ERROR,
    name,
    error,
  };
}

export function transactionSuccess(name, output) {
  return {
    type: TRANSACTION_SUCCESS,
    name,
    output,
  };
}

export function transactionReset(name) {
  return {
    type: TRANSACTION_RESET,
    name,
  };
}


// transaction actions
export function recentVotersLoaded(proposalID, recentVoters) {
  return {
    type: PROPOSAL_RECENT_VOTERS,
    proposalID,
    recentVoters,
  };
}

export function loadBoard(address) {
  return {
    type: LOAD_BOARD,
    address,
  };
}

export function vote(position) {
  return {
    type: VOTE,
    position,
  };
}


// executing acitons

export function execute() {
  return {
    type: EXECUTE,
  };
}

export function executeError(proposalID, message) {
  return {
    type: EXECUTE_ERROR,
    proposalID,
    message,
  };
}

export function executeTx(proposalID, transactionHash) {
  return {
    type: EXECUTE_TX,
    proposalID,
    transactionHash,
  };
}

export function executeSuccess(proposalID, txReceipt) {
  return {
    type: EXECUTE_SUCCESS,
    proposalID,
    txReceipt,
  };
}


// voting acitons

export function voteError(proposalID, message) {
  return {
    type: VOTE_ERROR,
    proposalID,
    message,
  };
}

export function voteCast(proposalID, voteDetails, transactionHash) {
  return {
    type: VOTE_CAST,
    proposalID,
    voteDetails,
    transactionHash,
  };
}

export function voteTx(proposalID, transactionHash) {
  return {
    type: VOTE_TX,
    proposalID,
    transactionHash,
  };
}

export function boardLoaded({
  address = '0x',
  rules = '0x',
  balance = Eth.BN(0),
  numProposals = Eth.BN(0),
  rulesKind,
}) {
  return {
    type: BOARD_LOADED,
    address,
    rulesKind,
    rules,
    balance,
    numProposals,
  };
}

export function selectCurrentProposal(proposalID) {
  return {
    type: SELECT_PROPOSAL,
    proposalID,
  };
}

export function cancelBoardLoading(address, message) {
  return {
    type: CANCEL_BOARD_LOADING,
    address,
    message,
  };
}

export function loadProposal(proposalID) {
  return {
    type: LOAD_PROPOSAL,
    proposalID,
  };
}

export function proposalLoaded(proposalID, proposalData, proposalStringData) {
  return {
    type: PROPOSAL_LOADED,
    proposalID,
    proposalData,
    proposalStringData,
  };
}

export function cancelProposalLoading(proposalID, message) {
  return {
    type: CANCEL_PROPOSAL_LOADING,
    proposalID,
    message,
  };
}

export function newProposal({ name, description, proxy, debatePeriod = 0, destination, value, calldata, pollData, kind }) {
  return {
    type: NEW_PROPOSAL,
    name,
    kind,
    description,
    proxy,
    debatePeriod,
    destination,
    value,
    calldata,
    pollData,
  };
}

export function newProposalError(message) {
  return {
    type: NEW_PROPOSAL_ERROR,
    message,
  };
}

export function newProposalTransacitonCreated(transactionHash) {
  return {
    type: NEW_PROPOSAL_TX,
    transactionHash,
  };
}

export function cancelNewProposal(message) {
  return {
    type: CANCEL_NEW_PROPOSAL,
    message,
  };
}

export function proposalCreated(proposalID, txReceipt) {
  return {
    type: PROPOSAL_CREATED,
    proposalID,
    txReceipt,
  };
}

export function clearProposals() {
  return {
    type: CLEAR_PROPOSALS,
  };
}

export function loadAccount(address) {
  return {
    type: LOAD_ACCOUNT,
    address,
  };
}

export function accountLoaded(address, balance, valid, contributorInfo, tokenBalance, contributorExtensionInfo, memberUntil) {
  return {
    type: ACCOUNT_LOADED,
    address,
    balance,
    valid,
    tokenBalance,
    contributorInfo,
    contributorExtensionInfo,
    memberUntil,
  };
}
