# Blockchain-Based Task Manager

A decentralized task manager built using Solidity, deployed on the Ethereum Sepolia testnet using Alchemy, with a React frontend.

## Setup Instructions

### Smart Contract
1. Install dependencies:
   ```
   npm install
   ```
2. Compile the contract:
   ```
   npx hardhat compile
   ```
3. Deploy the contract to Ethereum Sepolia:
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Frontend
1. Navigate to the frontend directory:
   ```
   cd task-manager-frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the app:
   ```
   npm start
   ```

## Deployment Details

- **Contract Address**: `YOUR_DEPLOYED_CONTRACT_ADDRESS` (e.g., `0x1234567890abcdef1234567890abcdef12345678`)
- **Testnet**: Ethereum Sepolia
- **RPC Provider**: Alchemy (`https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

### Example Transactions (for Postman)

Below are example transactions you can use in Postman to interact with the contract (using a tool like `web3.js` or `ethers.js` in Postman):

- **Add a Task**:
  - Method: `addTask(string _title, string _description)`
  - Example Call:
    ```json
    {
      "to": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      "data": "0x... (encoded data for addTask('Test Task', 'Test Description'))"
    }
    ```
  - ABI for `addTask`:
    ```json
    {
      "inputs": [
        {"internalType": "string", "name": "_title", "type": "string"},
        {"internalType": "string", "name": "_description", "type": "string"}
      ],
      "name": "addTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    ```

- **Mark a Task as Completed**:
  - Method: `markTaskCompleted(uint256 _taskId)`
  - Example Call:
    ```json
    {
      "to": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      "data": "0x... (encoded data for markTaskCompleted(1))"
    }
    ```
  - ABI for `markTaskCompleted`:
    ```json
    {
      "inputs": [{"internalType": "uint256", "name": "_taskId", "type": "uint256"}],
      "name": "markTaskCompleted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    ```

- **Edit a Task**:
  - Method: `editTask(uint256 _taskId, string _title, string _description)`
  - Example Call:
    ```json
    {
      "to": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      "data": "0x... (encoded data for editTask(1, 'Updated Task', 'Updated Description'))"
    }
    ```
  - ABI for `editTask`:
    ```json
    {
      "inputs": [
        {"internalType": "uint256", "name": "_taskId", "type": "uint256"},
        {"internalType": "string", "name": "_title", "type": "string"},
        {"internalType": "string", "name": "_description", "type": "string"}
      ],
      "name": "editTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    ```

- **Delete a Task**:
  - Method: `deleteTask(uint256 _taskId)`
  - Example Call:
    ```json
    {
      "to": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      "data": "0x... (encoded data for deleteTask(1))"
    }
    ```
  - ABI for `deleteTask`:
    ```json
    {
      "inputs": [{"internalType": "uint256", "name": "_taskId", "type": "uint256"}],
      "name": "deleteTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    ```

### Contract Address on the Testnet

- **Address**: `YOUR_DEPLOYED_CONTRACT_ADDRESS`
- You can view the contract on Sepolia Etherscan: `https://sepolia.etherscan.io/address/YOUR_DEPLOYED_CONTRACT_ADDRESS`
- (Optional: If verified, include the verification link or status, e.g., `https://sepolia.etherscan.io/address/YOUR_DEPLOYED_CONTRACT_ADDRESS#code`.)

## ABI

The ABI for frontend interaction is available in `abi/TaskManagerABI.json`.

## Deployment Steps

- Set up Alchemy for the Sepolia testnet and obtain the RPC URL.
- Update `hardhat.config.js` with the Alchemy RPC URL and your private key (via `.env`).
- Deploy using `npx hardhat run scripts/deploy.js --network sepolia`.
