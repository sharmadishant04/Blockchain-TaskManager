import React, { useState, useEffect } from "react";
import { getContract } from "./utils/contract";
import "./App.css";

function App() {
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        setError("Please switch MetaMask to the Sepolia testnet.");
        return;
      }

      const contractInstance = await getContract();
      setContract(contractInstance);
      fetchTasks(contractInstance);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setError("Failed to connect to MetaMask: " + error.message);
    }
  };

  useEffect(() => {
    // Check if MetaMask is already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  const fetchTasks = async (contractInstance) => {
    if (!contractInstance) return;
    try {
      const taskIds = await contractInstance.fetchMyTasks();
      const taskList = [];
      for (let id of taskIds) {
        const task = await contractInstance.tasks(id);
        taskList.push({
          id: id.toString(),
          title: task.title,
          description: task.description,
          completed: task.completed,
        });
      }
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks: " + error.message);
    }
  };

  const addTask = async () => {
    if (!contract || !title || !description) return;
    try {
      const tx = await contract.addTask(title, description);
      await tx.wait();
      setTitle("");
      setDescription("");
      fetchTasks(contract);
      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task: " + error.message);
    }
  };

  const markCompleted = async (taskId) => {
    if (!contract) return;
    try {
      const tx = await contract.markTaskCompleted(taskId);
      await tx.wait();
      fetchTasks(contract);
      alert("Task marked as completed!");
    } catch (error) {
      console.error("Error marking task as completed:", error);
      setError("Failed to mark task as completed: " + error.message);
    }
  };

  const editTask = async (taskId) => {
    if (!contract || !editTitle || !editDescription) return;
    try {
      const tx = await contract.editTask(taskId, editTitle, editDescription);
      await tx.wait();
      setEditTaskId(null);
      setEditTitle("");
      setEditDescription("");
      fetchTasks(contract);
      alert("Task edited successfully!");
    } catch (error) {
      console.error("Error editing task:", error);
      setError("Failed to edit task: " + error.message);
    }
  };

  const deleteTask = async (taskId) => {
    if (!contract) return;
    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      fetchTasks(contract);
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task: " + error.message);
    }
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  return (
    <div className="App">
      <h1>Blockchain Task Manager</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Account: {account}</p>
          <div className="add-task">
            <h2>Add a New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={addTask} disabled={!title || !description}>
              Add Task
            </button>
          </div>

          <h2>My Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  {editTaskId === task.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button onClick={() => editTask(task.id)} disabled={!editTitle || !editDescription}>
                        Save
                      </button>
                      <button onClick={() => setEditTaskId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{task.title}</strong> - {task.description} (Completed: {task.completed ? "Yes" : "No"})
                      <div className="task-actions">
                        {!task.completed && (
                          <button onClick={() => markCompleted(task.id)}>Mark Completed</button>
                        )}
                        <button onClick={() => startEditing(task)}>Edit</button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;