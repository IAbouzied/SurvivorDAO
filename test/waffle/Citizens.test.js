import {expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Citizens = require("../../build/waffle-contracts/Citizens.json");

use(solidity);

describe('Citizens', () => {
  const [orchestrator, wallet1, wallet2] = new MockProvider().getWallets();
  let citizens, citizensSigned1, citizensSigned2;

  const CITIZEN_NAME_1 = "Socrates";
  const CITIZEN_NAME_2 = "Plato";

  describe('Minting', () => {
    beforeEach(async () => {
      citizens = await deployContract(orchestrator, Citizens, []);
      citizensSigned1 = citizens.connect(wallet1);
      citizensSigned2 = citizens.connect(wallet2);
    });

    it('Successfully mint a citizen', async () => {
      const transaction = await citizensSigned1.mintNFT(CITIZEN_NAME_1);

      const citizen = await citizens.getCitizen(1);
      expect(citizen.name).to.equal(CITIZEN_NAME_1);
      expect(citizen.exiled).to.equal(false);
      expect(citizen.roundsSurvived).to.equal(0);

      expect(await citizens.balanceOf(wallet1.address)).to.equal(1);
      expect(await citizens.ownerOf(1)).to.equal(wallet1.address);
    });

    it('Limits ownership to one Citizen', async () => {
      await citizensSigned1.mintNFT(CITIZEN_NAME_1);

      await expect(citizensSigned1.mintNFT(CITIZEN_NAME_2)).to.be.reverted;
    });

    it('Multiple people can mint', async () => {
      await citizensSigned1.mintNFT(CITIZEN_NAME_1);
      await citizensSigned2.mintNFT(CITIZEN_NAME_2);

      expect(await citizens.ownerOf(1)).to.equal(wallet1.address);
      expect(await citizens.ownerOf(2)).to.equal(wallet2.address);
    });

    it('Stop minting if the game has started', async () => {
      await citizens.startGame();

      await expect(citizensSigned1.mintNFT(CITIZEN_NAME_1)).to.be.reverted;
    });
  });
});
