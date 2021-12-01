import axios from "axios";
import React, { useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { useParams } from "react-router";
import { isNumberRed, SERVER_URL, wheelData } from "../constants";

import { Button, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";

/**
 * TODO :
 * 1. Add Option for other type of bets like odd/even
 * 4. Add a selection table to choose the number.
 */

export default function RouletteWheel(props) {
	const params = useParams();
	const [user, setUser] = React.useState({});
	const [bet, setBet] = React.useState(0);
	const [isPlaced, setIsPlaced] = React.useState(false);
	const [isSpinning, setIsSpinning] = React.useState(false);
	const [prize, setPrize] = React.useState(0);
	const [tempUser, setTempUser] = React.useState({});
	const [winner, setWinner] = React.useState(false);
	const [showWinner, setShowWinner] = React.useState(false);
	const [showNumber, setShowNumber] = React.useState(false);
	const [amount, setAmount] = React.useState(100);
	const [errMessage, setErrMessage] = React.useState("");

	useEffect(() => {
		async function getData() {
			const res = await axios.get(`${SERVER_URL}/api/game/${params.id}`);
			const data = res.data;
			setUser(data);
		}
		if (params.id) {
			getData();
		}
	}, [params.id]);

	const handleChange = (e) => {
		setBet(e.target.value);
	};

	const handleChangeAmt = (e) => {
		setAmount(e.target.value);
	};

	const handleStopSpinning = () => {
		const u = tempUser;
		setIsSpinning(false);
		setUser(u);
		setIsPlaced(false);
		setShowWinner(true);
		setShowNumber(true);
		setAmount(100);
		setBet(0);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsPlaced(true);
		setShowWinner(false);
		setShowNumber(false);
		setErrMessage("");
		const body = {
			id: params.id,
			betAmt: amount,
			betType: bet,
		};
		axios
			.post(`${SERVER_URL}/api/game/bet`, body)
			.then((res) => {
				const { user, number, isWinner } = res.data;
				setPrize(number);
				setTempUser(user);
				setIsSpinning(true);
				setWinner(isWinner);
			})
			.catch((err) => {
				if (err.response?.status === 400) {
					setErrMessage(err.response.data);
					setIsSpinning(false);
					setIsPlaced(false);
					setShowWinner(false);
					setShowNumber(false);
					setAmount(0);
				}
			});
	};

	return (
		<>
			<div className="flex flex-row mt-20">
				<div className="ml-10 mr-20">
					<Wheel
						mustStartSpinning={isSpinning}
						prizeNumber={prize}
						data={wheelData}
						backgroundColors={["#3e3e3e", "#df3428"]}
						textColors={["#ffffff"]}
						innerRadius={70}
						innerBorderWidth={10}
						outerBorderWidth={10}
						textDistance={85}
						perpendicularText={true}
						onStopSpinning={handleStopSpinning}
					/>
				</div>
				<div className="flex flex-col items-center pt-5 pl-20">
					<div className="pb-2">
						{showNumber && (
							<span className="text-2xl text-blue-800">
								The Number on Wheel is{" "}
								<span
									className={
										isNumberRed[prize] ? "text-red-700 font-bold" : "text-black font-bold"
									}>
									{prize}
								</span>
							</span>
						)}
					</div>
					<div className="pb-5">
						{showWinner &&
							(winner ? (
								<span className="text-green-700 text-2xl">You Won the Bet</span>
							) : (
								<span className="text-red-700 text-2xl">You Lost the Bet</span>
							))}
					</div>
					<div className="pb-5">
						{errMessage.length > 0 && (
							<span className="text-2xl text-red-700">{errMessage}</span>
						)}
					</div>
					<div>
						<form onSubmit={handleSubmit}>
							<InputLabel id="label1">Choose Bet</InputLabel>
							<Select
								labelId="label1"
								id="demo-simple-select-disabled"
								value={bet}
								onChange={handleChange}
								variant="filled"
								fullWidth
								disabled={isPlaced}>
								<MenuItem value={1}>Red</MenuItem>
								<MenuItem value={0}>Black</MenuItem>
							</Select>
							<InputLabel id="label2">Enter Bet Amount</InputLabel>
							<TextField
								labelId="label2"
								type="number"
								value={amount}
								onChange={handleChangeAmt}
								variant="filled"
								disabled={isPlaced}
							/>
							<div className="mt-5">
								<Button type="submit" fullWidth variant="contained" color="primary">
									Place Bet
								</Button>
							</div>
						</form>
					</div>
					<div className="mt-10 text-2xl font-bold">
						Your balance is <span className="text-green-700">{user.balance || 0}</span>
					</div>
				</div>
			</div>
		</>
	);
}
