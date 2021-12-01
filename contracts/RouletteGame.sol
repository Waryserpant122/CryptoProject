// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankOwned {
	address public bankAddress;

	constructor() {
		bankAddress = msg.sender;
	}

	modifier onlyOwner() {
		require(msg.sender == bankAddress);
		_;
	}
}

contract Roulette is BankOwned {
	uint256 public immutable TIMEOUT_FOR_BANK_REVEAL = 1 days;
	uint256 public immutable ROULETTE_NUMBER_COUNT = 37;

	// prettier-ignore
	bool[37] isNumberRed = [false, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, true, false, true, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, true, false, true];

	struct GameRound {
		bytes32 bankHash;
		uint256 bankSecretValue;
		uint256 userValue;
		bool hasUserBetOnRed;
		uint256 timeWhenSecretUserValueSubmitted;
		uint256 lockedFunds;
	}

	mapping(address => bool) public hasRequestedGame;
	mapping(address => GameRound) public gameRounds;
	mapping(address => uint256) public registeredFunds;

	event NewGameRequest(address indexed user);
	event BankVals(uint256 bSecret,bytes32 bHash);
	event WinnerDetails(uint256 number, address winnner);

	function increaseFunds() external payable {
		require(msg.value > 0, "Must send ETH");
		registeredFunds[msg.sender] += msg.value;
	}

	function withdrawMoney() external {
		require(registeredFunds[msg.sender] > 0, "No money present in wal");

		uint256 funds = registeredFunds[msg.sender];
		registeredFunds[msg.sender] = 0;

		(bool wasSuccessful, ) = msg.sender.call{ value: funds }("");
		require(wasSuccessful, "ETH transfer failed");
	}

  function getBalance() external view returns(uint256){
    uint256 funds = registeredFunds[msg.sender]; 
    return funds;
  }

	function initializeGame() external {
		require(!hasRequestedGame[msg.sender], "Already requested game");

		hasRequestedGame[msg.sender] = true;
		emit NewGameRequest(msg.sender);
	}

	function setInitialBankHash(bytes32 bankHash, address userAddress) external onlyOwner {
		require(gameRounds[userAddress].bankHash == 0x0, "Bank hash already set");
		gameRounds[userAddress].bankHash = bankHash;
	}

	function placeBet(
		bool hasUserBetOnRed,
		uint256 userValue,
		uint256 _betAmount
	) external {
		require(gameRounds[msg.sender].bankHash != 0x0, "Bank hash not yet set");
		require(gameRounds[msg.sender].userValue == 0, "Already placed bet");
		require(registeredFunds[bankAddress] >= _betAmount, "Not enough bank funds");
		require(registeredFunds[msg.sender] >= _betAmount, "Not enough user funds");

		gameRounds[msg.sender].userValue = userValue;
		gameRounds[msg.sender].hasUserBetOnRed = hasUserBetOnRed;
		gameRounds[msg.sender].lockedFunds = _betAmount * 2;
		gameRounds[msg.sender].timeWhenSecretUserValueSubmitted = block.timestamp;

		registeredFunds[msg.sender] -= _betAmount;
		registeredFunds[bankAddress] -= _betAmount;
	}

	function getHash(uint256 secret) pure external returns(bytes32){
		return keccak256(abi.encodePacked(secret));
	}

	function getHashSaved(address userAddress) view external returns(bytes32){
		return gameRounds[userAddress].bankHash;
	}

	function sendBankSecretValue(uint256 bankSecretValue, address userAddress) external {

		emit BankVals(bankSecretValue, gameRounds[userAddress].bankHash);

		require(gameRounds[userAddress].userValue != 0, "User has no value set");
		require(gameRounds[userAddress].bankSecretValue == 0, "Already revealed");
		require(
			keccak256(abi.encodePacked(bankSecretValue)) == gameRounds[userAddress].bankHash,
			"Bank reveal not matching commitment"
		);

		gameRounds[userAddress].bankSecretValue = bankSecretValue;

		_evaluateBet(userAddress);
		_resetContractFor(userAddress);

	}

	function checkBankSecretValueTimeout() external {
		require(gameRounds[msg.sender].bankHash != 0, "Bank hash not set");
		require(gameRounds[msg.sender].bankSecretValue == 0, "Bank secret is set");
		require(gameRounds[msg.sender].userValue != 0, "User value not set");
		require(
			block.timestamp >
				(gameRounds[msg.sender].timeWhenSecretUserValueSubmitted +
					TIMEOUT_FOR_BANK_REVEAL),
			"Timeout not yet reached"
		);

		registeredFunds[msg.sender] += gameRounds[msg.sender].lockedFunds;
		_resetContractFor(msg.sender);
	}

	function _resetContractFor(address userAddress) private {
		gameRounds[userAddress] = GameRound(0x0, 0, 0, false, 0, 0);
	}

	function _evaluateBet(address userAddress) private {
		uint256 random = gameRounds[userAddress].bankSecretValue ^
			gameRounds[userAddress].userValue;
		uint256 number = random % ROULETTE_NUMBER_COUNT;
		uint256 winningAmount = gameRounds[userAddress].lockedFunds;

		bool isNeitherRedNorBlack = number == 0;
		bool isRed = isNumberRed[number];
		bool hasUserBetOnRed = gameRounds[userAddress].hasUserBetOnRed;

		address winner;

		if (isNeitherRedNorBlack) winner = bankAddress;
		else if (isRed == hasUserBetOnRed) winner = userAddress;
		else winner = bankAddress;

		emit WinnerDetails(number, winner);

		registeredFunds[winner] += winningAmount;
	}
}
