import Immutable from 'seamless-immutable';

import {
  BOARD_LOADED,
  BOARD_DISCOVERED,
  PROPOSAL_COUNTS,

  PROPOSAL_LOADED,
  NEW_PROPOSAL_ERROR,
  PROPOSAL_CREATED,
  ACCOUNT_LOADED,
  NEW_PROPOSAL_TX,
  SELECT_PROPOSAL,
  VOTE_CAST,
  VOTE_ERROR,
  VOTE_TX,
  PROPOSAL_COUNT,
  PROPOSAL_RECENT_VOTERS,

  EXECUTE_TX,
  EXECUTE_SUCCESS,
  EXECUTE_ERROR,

  CLEAR_PROPOSALS,

  TRANSACTION_REQUEST,
  TRANSACTION_PENDING,
  TRANSACTION_ERROR,
  TRANSACTION_SUCCESS,

  NETWORK_LOADED,
} from './constants';

const boardInitialState = Immutable({
  address: '0x',
  rules: '0x',
  rulesKind: 'OpenRules',
  balance: '0',
  selectedProposal: null,
  numProposals: '0',
  passing: 0,
  failing: 0,
  active: 0,
  leadingProposalIds: {
    active: 0,
    passing: 0,
    failing: 0,
  },
});

const environmentInitialState = Immutable({
  version: null,
  network: null,
  selectedNetwork: 'rinkeby',
  isMetaMask: false,
  isInjected: false,
});

const proposalInitialState = Immutable({
});

const executeInitialState = Immutable({
  error: null,
  transactionHash: null,
  proposaID: null,
});

const voteInitialState = Immutable({
  cast: false,
  error: null,
  transactionHash: null,
  proposaID: null,
  position: null,
});

const newProposalInitialState = Immutable({
  created: false,
});

const accountInitialState = Immutable({
  balance: '0',
  address: '0x0000000000000000000000000000000000000000',
  valid: false,
});

const transactionsInitialState = Immutable({});

export function environmentReducer(state = environmentInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case NETWORK_LOADED:
      return state
        .setIn(['version'], action.version)
        .setIn(['network'], action.network)
        .setIn(['isInjected'], action.isInjected)
        .setIn(['isMetaMask'], action.isMetaMask);
    default:
      return state;
  }
}

export function transactionsReducer(state = transactionsInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case TRANSACTION_REQUEST:
      return state.merge({
        [action.name]: {
          error: null,
          constant: action.constant || false,
          success: false,
          pending: true,
          transactionHash: null,
          inputs: action.inputs,
        },
      });
    case TRANSACTION_PENDING:
      return state
        .setIn([action.name, 'pending'], true)
        .setIn([action.name, 'transactionHash'], action.transactionHash);
    case TRANSACTION_ERROR:
      return state
        .setIn([action.name, 'pending'], false)
        .setIn([action.name, 'success'], false)
        .setIn([action.name, 'error'], action.error);
    case TRANSACTION_SUCCESS:
      return state
        .setIn([action.name, 'pending'], false)
        .setIn([action.name, 'success'], true)
        .setIn([action.name, 'output'], action.output);
    default:
      return state;
  }
}

export function executeProposalReducer(state = executeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case EXECUTE_ERROR:
      return state
        .setIn(['pending'], false)
        .setIn(['error'], action.message);
    case EXECUTE_TX:
      return state.merge({
        error: null,
        pending: true,
        success: false,
        proposalID: action.proposalID,
        transactionHash: action.transactionHash,
      });
    case EXECUTE_SUCCESS:
      return state.merge({
        error: null,
        pending: false,
        success: true,
        transactionHash: action.txReceipt.transactionHash,
      });
    default:
      return state;
  }
}

export function newProposalReducer(state = newProposalInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case NEW_PROPOSAL_ERROR:
      return state.setIn(['error'], {
        message: action.message,
      });
    case NEW_PROPOSAL_TX:
      return state.merge({
        created: false,
        transactionHash: action.transactionHash,
      });
    case PROPOSAL_CREATED:
      return state.merge({
        created: true,
        proposalID: action.proposalID,
        transactionHash: action.txReceipt.transactionHash,
      });
    default:
      return state;
  }
}

export function voteReducer(state = voteInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case VOTE_CAST:
      return state.merge({
        proposalID: action.proposalID,
        position: action.voteDetails.position,
        created: action.voteDetails.created,
        weight: action.voteDetails.weight,
        pending: false,
        transactionHash: action.transactionHash,
        error: null,
        cast: true,
      });
    case VOTE_ERROR:
      return state.merge({
        pending: false,
        proposalID: action.proposalID,
        error: action.message,
      });
    case VOTE_TX:
      return state.merge({
        pending: true,
        proposalID: action.proposalID,
        transactionHash: action.transactionHash,
        error: null,
      });
    default:
      return state;
  }
}

export function accountReducer(state = accountInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case ACCOUNT_LOADED:
      return state.merge({
        address: action.address,
        balance: action.balance.toString(10),
        valid: action.valid,
      });
    default:
      return state;
  }
}

export function boardReducer(state = boardInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case SELECT_PROPOSAL:
      return state.setIn(['selectedProposal'], action.proposalID);
    case PROPOSAL_COUNTS:
      return state.merge({
        passing: action.counts.passing,
        failing: action.counts.failing,
        active: action.counts.active,
        leadingProposalIds: action.counts.leadingProposalIds,
      });
    case BOARD_LOADED:
      return state.merge({
        address: action.address,
        rules: action.rules,
        rulesKind: action.rulesKind,
        balance: action.balance.toString(10),
        selectedProposal: action.selectedProposal || null,
        numProposals: action.numProposals.toString(10),
        passing: 0,
        failing: 0,
        active: 0,
        leadingProposalIds: {
          active: 0,
          passing: 0,
          failing: 0,
        },
      });
    default:
      return state;
  }
}

const boardsInitialState = Immutable({});

export function boardsReducer(state = boardsInitialState, action) {
  switch (action.type) {
    case BOARD_DISCOVERED:
      return state.merge({
        [action.address]: true,
      });
    default:
      return state;
  }
}

export function votesReducer(state = proposalInitialState, action) {
  switch (action.type) {
    case PROPOSAL_RECENT_VOTERS:
      return state.merge({
        [action.proposalID]: action.recentVoters,
      });
    default:
      return state;
  }
}

export function proposalsReducer(state = proposalInitialState, action) {
  switch (action.type) {
    case CLEAR_PROPOSALS:
      return Immutable({});
    case PROPOSAL_LOADED:
      return state.merge({
        [action.proposalID]: {
          id: action.proposalID,
          name: action.proposalStringData.name,
          description: action.proposalStringData.description,
          kind: action.proposalStringData.kind,
          pollData: action.proposalStringData.pollData,
          calldata: action.proposalData.calldata,
          created: action.proposalData.created.toString(10),
          debatePeriod: action.proposalData.debatePeriod.toString(10),
          destination: action.proposalData.destination,
          executed: action.proposalData.executed,
          noPositionWeight: action.proposalData.noPositionWeight.toString(10),
          yesPositionWeight: action.proposalData.yesPositionWeight.toString(10),
          nonce: action.proposalData.nonce.toString(10),
          numVoters: action.proposalData.numVoters.toString(10),
          proxy: action.proposalData.proxy,
          from: action.proposalData.from,
          value: action.proposalData.value.toString(10),
          signature: action.proposalData.signature,
          hasWon: action.proposalData.hasWon,
          canExecute: action.proposalData.canExecute,
          hasFailed: action.proposalData.hasFailed,
          canVote: action.proposalData.canVote,
          active: action.proposalData.active,
          passing: action.proposalData.passing,
          failing: action.proposalData.failing,
          status: action.proposalData.status,
          positions: action.proposalData.positions,
          totalVotes: action.proposalData.totalVotes.toString(10),
        },
      });
    default:
      return state;
  }
}
