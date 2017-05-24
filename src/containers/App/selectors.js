import { createSelector } from 'reselect';

import environments from 'contracts/lib/environments.json';

export const selectRoute = state => state.route;

export const selectLanguage = state => state.language;

export const selectLocale = createSelector(
  selectLanguage,
  laguageState => laguageState.locale,
);

export const selectCurrentLocation = createSelector(
  selectRoute,
  routerState => routerState.location,
);

// transaction selectors
export const selectTransactions = state => state.transactions || {};

export const selectTransaction = (state, transactionName) => selectTransactions(state)[transactionName] || {};


// board selectors
export const selectBoard = state => state.board;

export const selectBoardAddress = state => selectBoard(state).address;

export const selectNumProposals = state => selectBoard(state).numProposals;

export const selectBoardBalance = state => selectBoard(state).balance;

export const selectBoardRules = state => selectBoard(state).rules;

export const selectBoardRulesKind = state => selectBoard(state).rulesKind;

export const selectBoards = state => state.boards;

export const selectProposalCounts = state => ({
  passing: state.board.passing,
  failing: state.board.failing,
  active: state.board.active,
  leadingProposalIds: state.board.leadingProposalIds,
});


// league selectors
export const selectLeague = state => state.league;


// vote selectors
export const selectVote = state => state.vote;

export const selectVoteTransactionHash = state => selectVote(state).transactionHash;

export const selectVoteError = state => selectVote(state).error;

export const selectVoteCreated = state => selectVote(state).created;

export const selectVotePending = state => selectVote(state).pending;

export const selectVoteProposalID = state => selectVote(state).proposalID;


// proposal selectors
export const selectProposals = state => state.proposals;

export const selectProposal = (state, proposalID) => state.proposals[proposalID] || {};

export const selectedProposal = state => state.board.selectedProposal;


// new proposal
export const selectNewProposalError = state => (state.newProposal.error || {}).message;

export const selectNewProposalTransactionHash = state => state.newProposal.transactionHash;

export const selectNewProposalProposalID = state => state.newProposal.proposalID;

export const selectNewProposalPending = state => state.newProposal.pending;


// account selectors
export const selectAccount = state => state.account;

export const selectAccountAddress = state => selectAccount(state).address;

export const selectAccountBalance = state => selectAccount(state).balance;

export const selectAccountValid = state => selectAccount(state).valid;


// execution
export const selectExecuteTransactionHash = state => state.executeProposal.transactionHash;

export const selectExecuteError = state => state.executeProposal.error;

export const selectExecuteProposalID = state => state.executeProposal.proposalID;

export const selectExecuteSuccess = state => state.executeProposal.success;

export const selectExecutePending = state => state.executeProposal.pending;


// environment
export const selectEnvironment = state => state.environment;


// proposal votes
export const selectProposalVotes = (state, proposalID) => state.proposalVotes[proposalID].ids;

export const selectProposalVote = (state, proposalID, voteID) => state.proposalVotes[proposalID][voteID];


// contribute info
export const selectContributeInfo = state => state.contributeInfo;
