const Citizens = artifacts.require("Citizens");

contract("Citizens", (accounts) => {
    let citizens;
    const FIRST_OWNER_ID = 0;

    before(async () => {
        citizens = await Citizens.deployed();
    })

    describe("Minting an NFT", async () => {
        let firstOwner;
        before("Mint 1 Citizen", async () => {
            firstOwner = accounts[FIRST_OWNER_ID];
            await citizens.mintNFT({ from: firstOwner });
        });

        it("Should successfully assigned a Citizen to a user", async () => {
            firstCitizenId = 1;
            const nonOwnerAddress = accounts[FIRST_OWNER_ID+1];
            const ownerAddress = await citizens.ownerOf(firstCitizenId, { from: firstOwner });

            assert.notEqual(ownerAddress, nonOwnerAddress);
            assert.equal(ownerAddress, ownerAddress);
        });
    });
});