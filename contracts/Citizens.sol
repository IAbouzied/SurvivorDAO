// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Citizens is ERC721Votes {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bool _gameStarted = false;

    constructor() ERC721("Citizens", "CTZN") EIP712("SurvivorDAO", "1.0.0")  {}

    function mintNFT()
        public
        returns (uint256)
    {
        require(balanceOf(_msgSender()) == 0);
        require(!gameStarted());
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);

        return newItemId;
    }

    function delegate(address delegatee) public virtual override {
        require(delegatee != _msgSender());
        address account = _msgSender();
        _delegate(account, delegatee);
    }

    function startGame() external {
        _gameStarted = true;
    }

    function gameStarted() public view returns (bool) {
        return _gameStarted;
    }
}