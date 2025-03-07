// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is Ownable {
    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        address owner;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskAdded(uint256 indexed taskId, string title, string description, address owner);
    event TaskMarkedCompleted(uint256 indexed taskId, address owner);
    event TaskEdited(uint256 indexed taskId, string title, string description, address owner);
    event TaskDeleted(uint256 indexed taskId, address owner);

    modifier onlyTaskOwner(uint256 _taskId) {
        require(tasks[_taskId].owner == msg.sender, "Only the task owner can perform this action");
        _;
    }

    constructor() Ownable(msg.sender) {
        taskCount = 0;
    }

    function addTask(string memory _title, string memory _description) external {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _title, _description, false, msg.sender);
        emit TaskAdded(taskCount, _title, _description, msg.sender);
    }

    function markTaskCompleted(uint256 _taskId) external onlyTaskOwner(_taskId) {
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        tasks[_taskId].completed = true;
        emit TaskMarkedCompleted(_taskId, msg.sender);
    }

    function editTask(uint256 _taskId, string memory _title, string memory _description) external onlyTaskOwner(_taskId) {
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        tasks[_taskId].title = _title;
        tasks[_taskId].description = _description;
        emit TaskEdited(_taskId, _title, _description, msg.sender);
    }

    function deleteTask(uint256 _taskId) external onlyTaskOwner(_taskId) {
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        delete tasks[_taskId];
        emit TaskDeleted(_taskId, msg.sender);
    }

    function fetchMyTasks() external view returns (uint256[] memory) {
        uint256 totalTasks = taskCount;
        uint256 myTaskCount = 0;

        for (uint256 i = 1; i <= totalTasks; i++) {
            if (tasks[i].owner == msg.sender) {
                myTaskCount++;
            }
        }

        uint256[] memory myTaskIds = new uint256[](myTaskCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalTasks; i++) {
            if (tasks[i].owner == msg.sender) {
                myTaskIds[index] = i;
                index++;
            }
        }
        return myTaskIds;
    }
}