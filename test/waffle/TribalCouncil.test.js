import {expect, use} from 'chai';
import {Contract, constants} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Citizens = require('../../build/waffle-contracts/Citizens.json');
const TribalCouncil = require('../../build/waffle-contracts/TribalCouncil.json');

use(solidity);

describe('TribalCouncil', () => {
  const [orchestrator, wallet1, wallet2] = new MockProvider().getWallets();
  let tribalCouncil, citizens, citizensSigned1, citizensSigned2, encodedFunctionData;

  const CITIZEN_NAME_1 = 'Socrates';
  const CITIZEN_NAME_2 = 'Plato';
  const PROPOSAL_NAME = 'The Republic';

  beforeEach(async () => {
    citizens = await deployContract(orchestrator, Citizens, []);
    tribalCouncil = await deployContract(orchestrator, TribalCouncil, [citizens.address]);
    encodedFunctionData = citizens.interface.encodeFunctionData('name', []);
  });

  it('Dont allow proposals if the game has not started', async () => {
    await expect(tribalCouncil.propose([citizens.address], [0], [encodedFunctionData], 'First proposal'))
      .to.be.reverted;
  });
});
