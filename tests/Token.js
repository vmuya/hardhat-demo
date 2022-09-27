const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const TokenContractFactory = await ethers.getContractFactory("Token");
    const [owner, user1, user2] = await ethers.getSigners();

    const tokenContract = await TokenContractFactory.deploy();

    await tokenContract.deployed();

    return { TokenContractFactory, tokenContract, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { tokenContract, owner } = await loadFixture(deployTokenFixture);

      expect(await tokenContract.owner()).to.equal(owner.address);
    });

    it("should assign total token supply to owner when deployed", async function () {
      const { tokenContract, owner } = await loadFixture(deployTokenFixture);

      const ownerBalance = await tokenContract.balanceOf(owner.address);
      expect(await tokenContract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("should transfer tokens between accounts", async function () {
      const { tokenContract, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to address1
      await tokenContract.transfer(user1.address, 50);
      expect(await tokenContract.balanceOf(user1.address)).to.equal(50);

      // Transfer 50 tokens from address1 to address2
      await tokenContract.connect(user1).transfer(user2.address, 50);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(50);
    });

    it("should trigger Transfer events", async function () {
      const { tokenContract, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to address1
      await expect(tokenContract.transfer(user1.address, 50))
        .to.emit(tokenContract, "Transfer")
        .withArgs(owner.address, user1.address, 50);

      // Transfer 50 tokens from address1 to address2
      await expect(tokenContract.connect(user1).transfer(user2.address, 50))
        .to.emit(tokenContract, "Transfer")
        .withArgs(user1.address, user2.address, 50);
    });

    it("should fail if sender doesn’t have enough tokens", async function () {
      const { tokenContract, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      const initialOwnerBalance = await tokenContract.balanceOf(owner.address);

      // Try to send 1 token from address1 (0 tokens) to address, revert the transaction if false
      await expect(
        tokenContract.connect(user1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed
      expect(await tokenContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
