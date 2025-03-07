const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskManager", function () {
  let TaskManager, taskManager, owner, addr1;

  beforeEach(async function () {
    // Get signers (accounts)
    [owner, addr1] = await ethers.getSigners();

    // Deploy the contract
    TaskManager = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManager.deploy();
    await taskManager.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await taskManager.owner()).to.equal(owner.address);
  });

  it("Should add a task", async function () {
    await taskManager.addTask("Test Task", "Test Description");
    const task = await taskManager.tasks(1);
    expect(task.title).to.equal("Test Task");
    expect(task.owner).to.equal(owner.address);
  });

  it("Should mark a task as completed", async function () {
    await taskManager.addTask("Test Task", "Test Description");
    await taskManager.markTaskCompleted(1);
    const task = await taskManager.tasks(1);
    expect(task.completed).to.be.true;
  });

  it("Should fail to edit a task if not the owner", async function () {
    await taskManager.addTask("Test Task", "Test Description");
    await expect(
      taskManager.connect(addr1).editTask(1, "New Title", "New Description")
    ).to.be.revertedWith("Only the task owner can perform this action");
  });
});