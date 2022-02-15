// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Citizens is ERC721Votes {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Citizens", "CTZN") EIP712("SurvivorDAO", "1.0.0")  {}

    function mintNFT()
        public
        returns (uint256)
    {
        require(balanceOf(msg.sender) == 0);
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        return newItemId;
    }
}