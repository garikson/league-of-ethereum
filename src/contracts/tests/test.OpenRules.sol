/*
This file is part of WeiFund.

WeiFund is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "src/contracts/BoardRoom.sol";
import "src/contracts/OpenRules.sol";

contract TestOpenRules is Test {
  BoardRoom board;
  OpenRules rules;
  address[] members;

  function setup() {
    members.push(address(this));
    rules = new OpenRules(members);
    board = new BoardRoom(address(rules));
    rules.configureBoard(address(board));
  }

  function test_vote() {
    assertEq(board.newProposal("Name",
      address(0),
      0,
      address(0),
      0,
      ""), 0);
    assertEq(board.vote(0, 1), 1);
    assertEq(board.hasVoted(0, address(this)), true);
    assertEq(board.positionWeightOf(0, 1), uint256(1));
  }

  function test_vote_2_shouldThrow() {
    board.vote(0, 1);
  }
}
