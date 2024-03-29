
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../node_modules/@openzeppelin/contracts/governance/Governor.sol";
import "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "./Citizens.sol";

contract TribalCouncil is Governor, GovernorVotes, GovernorVotesQuorumFraction, GovernorCountingSimple {
    Citizens private _citizens;
    uint256[] private _proposalIds;

    constructor(Citizens _token)
    Governor("MyGovernor")
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
    {
        _citizens = _token;
    }

    function votingDelay() public pure override returns (uint256) {
        return 0;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 45; // 10 min
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 0;
    }

    // The functions below are overrides required by Solidity.

    function quorum(uint256 blockNumber)
    public
    view
    override(IGovernor, GovernorVotesQuorumFraction)
    returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
    public
    view
    override(IGovernor, GovernorVotes)
    returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function state(uint256 proposalId)
    public
    view
    override(Governor)
    returns (ProposalState)
    {
        ProposalState proposalState = super.state(proposalId);
        if (proposalState == ProposalState.Active) {
            (uint256 support, uint256 against, uint256 abstain) = proposalVotes(proposalId);
            uint256 totalVotes = support + against + abstain;
            bool allVotesIn = _citizens.maxActiveVoters() <= totalVotes;
            if (!allVotesIn) {
                return ProposalState.Active;
            }

            if (_quorumReached(proposalId) && _voteSucceeded(proposalId)) {
                return ProposalState.Succeeded;
            } else {
                return ProposalState.Defeated;
            }
        }
        return proposalState;
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    public
    override(Governor)
    returns (uint256)
    {
        require(_citizens.gameStarted(), "Proposals not allowed until the game has begun");
        require(!_activeProposalExists(), "There is already an active proposal");
        uint256 proposalId = super.propose(targets, values, calldatas, description);
        _proposalIds.push(proposalId);
        return proposalId;
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    override(Governor)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    override(Governor)
    returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
    internal
    view
    override(Governor)
    returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(Governor)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _activeProposalExists()
    private
    view
    returns (bool)
    {
        for (uint i = 0; i < _proposalIds.length; i++) {
            ProposalState proposalState = state(_proposalIds[i]);
            if (proposalState == ProposalState.Active) {
                return true;
            }
        }
        return false;
    }
}
