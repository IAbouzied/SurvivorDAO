import {expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Citizens = require("../../build/waffle-contracts/Citizens.json");

use(solidity);

describe('Citizens', () => {
  const [wallet, walletTo] = new MockProvider().getWallets();
  let citizens;

  beforeEach(async () => {
    citizens = await deployContract(wallet, Citizens, []);
  });

  it('Is correctly named', async () => {
    expect(await citizens.name()).to.equal("Citizens");
  });
});