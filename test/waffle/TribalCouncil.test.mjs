import {expect, use} from 'chai';
import {Contract, constants} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Citizens = require('../../build/waffle-contracts/Citizens.json');
const TribalCouncil = require('../../build/waffle-contracts/TribalCouncil.json');

use(solidity);

describe('TribalCouncil', () => {
  const provider = new MockProvider();
  const [orchestrator, wallet1, wallet2] = provider.getWallets();
  let tribalCouncil, citizens, citizensSigned1, citizensSigned2, encodedFunctionData;

  const CITIZEN_NAME_1 = 'Socrates';
  const CITIZEN_NAME_2 = 'Plato';
  const PROPOSAL_NAME = 'The Republic';
  const PROPOSAL_ACTIVE = 1;
  const PROPOSAL_SUCCEEDED = 4;
  const VOTE_FOR = 1;

  beforeEach(async () => {
    citizens = await deployContract(orchestrator, Citizens, []);
    tribalCouncil = await deployContract(orchestrator, TribalCouncil, [citizens.address]);
    encodedFunctionData = citizens.interface.encodeFunctionData('name', []);
  });

  it('Dont allow proposals if the game has not started', async () => {
    await expect(tribalCouncil.propose([citizens.address], [0], [encodedFunctionData], PROPOSAL_NAME))
      .to.be.reverted;
  });

  it('Dont allow proposals if one is already in progress', async () => {
    await citizens.mintNFT(CITIZEN_NAME_1);
    await citizens.startGame();

    await tribalCouncil.propose([citizens.address], [0], [encodedFunctionData], PROPOSAL_NAME);
    await expect(tribalCouncil.propose([citizens.address], [0], [encodedFunctionData], PROPOSAL_NAME+'2'))
      .to.be.reverted;
  });

  it('End voting if all players voted', async () => {
    // Setup voters
    let citizensSigned1 = citizens.connect(wallet1);
    let citizensSigned2 = citizens.connect(wallet2);
    await citizensSigned1.mintNFT(CITIZEN_NAME_1);
    await citizensSigned2.mintNFT(CITIZEN_NAME_2);
    await citizensSigned1.delegate(wallet2.address);
    await citizensSigned2.delegate(wallet1.address);
    await citizens.startGame();

    // Make proposal
    let proposal = await tribalCouncil.propose([citizens.address], [0], [encodedFunctionData], PROPOSAL_NAME);
    let receipt = await proposal.wait();
    let proposalId = receipt.events[0].args[0];
    await provider.send('evm_mine');

    expect(await tribalCouncil.state(proposalId)).to.equal(PROPOSAL_ACTIVE);

    // Conduct votes
    let tribalCouncilSigned1 = tribalCouncil.connect(wallet1);
    let tribalCouncilSigned2 = tribalCouncil.connect(wallet2);
    await tribalCouncilSigned1.castVote(proposalId, VOTE_FOR);
    await tribalCouncilSigned2.castVote(proposalId, VOTE_FOR);

    expect(await tribalCouncil.state(proposalId)).to.equal(PROPOSAL_SUCCEEDED);
  });
});
