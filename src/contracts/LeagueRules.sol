pragma solidity ^0.4.8;

import "src/contracts/Owned.sol";
import "src/contracts/Proxy.sol";
import "src/contracts/Rules.sol";
import "src/contracts/BoardRoom.sol";
import "src/contracts/MiniMeToken.sol";

/**
 * DonorClub lets contributors pay membership dues as donations to any of a
 * list of potential recipients.
 */
contract LeagueRules is Owned, Rules, Proxy {
  // Contributions add to the contributor's `duesBalance`. If  `duesBalance`
  // is high enough to extend a membership, `membershipPeriod` is added to
  // `memberUntil`. Memberships can only be extended in the second half of the
  // membership period. Overpaid dues are not carried over multiple periods:
  // each extension resets the `duesBalance` to zero. Periodic contributions are
  // required, but extra contributions are always welcome!

  struct Contributor {
    uint duesBalance;
    uint total;
    uint joinedAt;
    uint memberUntil;
    uint firstSeenAt;
  }

  struct Recipient {
    uint total;
    uint limit;
    uint firstSeenAt;
  }

  event Contributed(address contributor, address recipient, uint amount);
  event NewMember(address member);
  event MembershipExtended(address member, uint until);
  event NewRecipient(address recipient);
  event RecipientLimitSet(address recipient, uint limit);

  uint public duesAmount;
  uint public membershipPeriod;
  uint public gracePeriod;
  uint public approvalPercent;
  uint public quorumVotes;
  uint public maxDebatePeriod;
  uint public total;
  mapping (address => Recipient) public recipients;
  address[] public recipientList;
  mapping (address => Contributor) public contributors;
  address[] public contributorList;
  MiniMeToken public contributionToken;

  function LeagueRules(
      uint _duesAmount, uint _membershipPeriod, uint _gracePeriod,
      address[] _recipients, uint[] _limits, uint _approvalPercent, uint _quorumVotes,
      uint _maxDebatePeriod, address _token) {
    owner = msg.sender;
    setToken(_token);
    setDues(_duesAmount, _membershipPeriod, _gracePeriod);
    setGovernance(_approvalPercent, _quorumVotes, _maxDebatePeriod);
    for (uint i = 0; i < _recipients.length; i++) {
      addRecipient(_recipients[i], _limits[i]);
    }
  }

  function setToken(address token) onlyOwner {
    contributionToken = MiniMeToken(token);
  }

  function setDues(uint amount, uint period, uint grace) onlyOwner {
    duesAmount = amount;
    membershipPeriod = period;
    gracePeriod = grace;
  }

  function addRecipient(address addr, uint limit) onlyOwner {
    Recipient recipient = recipients[addr];
    RecipientLimitSet(addr, limit);
    recipient.limit = limit;

    if (recipient.firstSeenAt == 0) {
      NewRecipient(addr);
      recipient.firstSeenAt = now;
      recipientList.push(addr);
    }
  }

  /**
   * Recipients with non-zero limits can adjust their own limit. This lets them
   * adjust how much of member funds they're willing to be responsible for.
   *
   * This doesn't let the club restrict the recipient's funds. To do that, the
   * club should call addRecipient(recipient, 0).
   */
  function setRecipientLimit(address addr, uint limit) {
    Recipient recipient = recipients[addr];
    if (recipient.limit == 0 || msg.sender != addr) {
      throw;
    }

    RecipientLimitSet(addr, limit);
    recipient.limit = limit;
  }

  function setGovernance(uint _approvalPercent, uint _quorumVotes, uint _maxDebatePeriod) onlyOwner {
    approvalPercent = _approvalPercent;
    quorumVotes = _quorumVotes;
    maxDebatePeriod = _maxDebatePeriod;
  }


  function isMember(address contributor) constant returns (bool) {
    return contributors[contributor].memberUntil > now;
  }

  function isInGrace(address contributor) constant returns (bool) {
    return !isMember(contributor) && contributors[contributor].memberUntil + gracePeriod > now;
  }

  function getRecipientsLength() constant returns (uint) {
    return recipientList.length;
  }

  function getContributorsLength() constant returns (uint) {
    return contributorList.length;
  }

  /**
   * Calculates how much an account should contribute to extend their
   * membership as long as possible. Contributing more than the returned
   * amount will not be held as a credit toward future membership
   * extensions.
   */
  function getMaximumExtension(address contributorAddress) constant returns (uint amount, uint until, bool newMember) {
    Contributor contributor = contributors[contributorAddress];
    if (!isMember(contributorAddress) && !isInGrace(contributorAddress)) {
      return (duesAmount - contributor.duesBalance, now + membershipPeriod, true);
    }

    until = contributor.memberUntil;
    while (true) {
      if (until > now) {
        break;
      }
      amount += duesAmount;
      until += membershipPeriod;
    }

    if (until - (membershipPeriod / 2) < now) {
      amount += duesAmount;
      until += membershipPeriod;
    }

    amount -= contributor.duesBalance;
  }

  function contribute(address recipientAddress) payable {
    contributeFor(msg.sender, recipientAddress);
  }

  function contributeFor(address contributorAddress, address recipientAddress) payable {
    if (msg.value == 0) {
      throw;
    }

    Recipient recipient = recipients[recipientAddress];
    // Reject contributions beyond the recipient's limit.
    if (msg.value + recipient.total > recipient.limit) {
      throw;
    }

    Contributor contributor = contributors[contributorAddress];
    // Record new contributors.
    if (contributor.firstSeenAt == 0) {
      contributor.firstSeenAt = now;
      contributorList.push(contributorAddress);
    }

    contributor.duesBalance += msg.value;
    contributor.total += msg.value;
    generateContributionTokens(contributorAddress, msg.value);
    extendMembershipFor(contributorAddress);

    Contributed(contributorAddress, recipientAddress, msg.value);
    recipient.total += msg.value;
    total += msg.value;
    if (!recipientAddress.send(msg.value)) {
      throw;
    }
  }

  function generateContributionTokens(address contributor, uint amount) {
    if (address(contributionToken) == 0) {
      return;
    }

    uint tokensEarned = 10**18 * amount / duesAmount;
    contributionToken.generateTokens(contributor, tokensEarned);
  }

  /**
   * Extend the contributor's membership if their dues balance is high enough.
   */
  function doExtendMembership(address contributorAddress) internal returns (bool) {
    Contributor contributor = contributors[contributorAddress];
    bool wasMember = isMember(contributorAddress);
    bool wasInGrace = isInGrace(contributorAddress);
    bool isSecondHalfOfPeriod = !wasMember || contributor.memberUntil - (membershipPeriod / 2) < now;
    if (contributor.duesBalance >= duesAmount && isSecondHalfOfPeriod) {
      contributor.duesBalance -= duesAmount;

      if (!wasMember && !wasInGrace) {
        NewMember(contributorAddress);
        contributor.joinedAt = now;
        contributor.memberUntil = now + membershipPeriod;
      } else {
        contributor.memberUntil += membershipPeriod;
      }

      MembershipExtended(contributorAddress, contributor.memberUntil);
      return true;
    }

    return false;
  }

  function extendMembership() {
    extendMembershipFor(msg.sender);
  }

  /**
   * Use the contributor's duesBalance to extend their membership as many times
   * as possible. Zero out the duesBalance if their membership was brought up-to-date
   * to discourage contributors from accumulating a duesBalance in advance.
   */
  function extendMembershipFor(address contributorAddress) {
    uint extensions = 0;
    while (true) {
      if (doExtendMembership(contributorAddress)) {
        extensions += 1;
      } else {
        break;
      }
    }
    if (extensions > 0 && isMember(contributorAddress)) {
      contributors[contributorAddress].duesBalance = 0;
    }
  }

  /**
   * Allow the board to send transactions as the DonorClub contract in case
   * assets are erroneously sent here.
   */
  function forward_transaction(address _destination, uint _value, bytes _calldata) public onlyOwner {
    if (!_destination.call.value(_value)(_calldata)) {
      throw;
    }
  }

  /**
   * Default rules to use with a BoardRoom contract.
   */

  function isVotingOpen(uint _proposalID) public constant returns (bool) {
    // Voting closes after the debate period for the given proposal.
    BoardRoom board = BoardRoom(msg.sender);
    uint created = board.createdOn(_proposalID);
    uint debatePeriod = board.debatePeriodOf(_proposalID);
    if (debatePeriod > maxDebatePeriod) {
      debatePeriod = maxDebatePeriod;
    }
    return now < created + debatePeriod;
  }

  function hasWon(address _sender, uint _proposalID) public constant returns (bool) {
    // Proposals must have at least `quorumVotes` votes from members. Once that
    // threshold is hit, `approvalPercent` of yea votes are required for the
    // transaction to execute.
    BoardRoom board = BoardRoom(msg.sender);
    uint nay = board.positionWeightOf(_proposalID, 0);
    uint yea = board.positionWeightOf(_proposalID, 1);
    uint totalVotes = nay + yea;

    // approvalPercent is an integer per hundred (60% = 60). Multiply the
    // yea votes by 100 to match.
    bool hasApproval = yea * 100 > totalVotes * approvalPercent;
    if(hasApproval && totalVotes >= quorumVotes) {
      return true;
    }
    return false;
  }

  function hasFailed(address _sender, uint256 _proposalID) public constant returns (bool) {
    return !hasWon(_sender, _proposalID) && !isVotingOpen(_proposalID);
  }

  function canExecute(address _sender, uint256 _proposalID) public constant returns (bool) {
    return hasWon(_sender, _proposalID);
  }

  function canVote(address _sender, uint256 _proposalID, uint256 _position) public constant returns (bool) {
    // Any member who hasn't already voted on the given proposal is allowed to vote
    // if voting hasn't closed yet.
    BoardRoom board = BoardRoom(msg.sender);
    if(isMember(_sender) && isVotingOpen(_proposalID) && !board.hasVoted(_proposalID, _sender)) {
      return true;
    }
  }

  function canPropose(address _sender) public constant returns (bool) {
    return isMember(_sender);
  }

  function votingWeightOf(address _sender, uint _proposalID) public constant returns (uint) {
    return 1;
  }
}
