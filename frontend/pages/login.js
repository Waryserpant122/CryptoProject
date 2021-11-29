import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";
import { SERVER_URL } from "../constants";
import { useRouter } from "next/router";

export default function Login() {
	const router = useRouter();

	const [formData, setFormData] = useState({
		user: {
			username: "",
			password: "",
		},
	});

	const [errMessage, setErrMessage] = useState("");

	const handleChange = (e) => {
		setFormData({
			user: {
				...formData.user,
				[e.target.name]: e.target.value,
			},
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData.user);
		axios
			.post(`${SERVER_URL}/api/login`, formData.user)
			.then((res) => {
				router.replace(`/game/${res.data.id}`);
			})
			.catch((err) => {
				if (err.response?.status === 400) {
					setErrMessage(err.response.data);
					setFormData({
						user: {
							username: "",
							password: "",
						},
					});
				}
			});
	};

	return (
		<figure className="h-screen flex bg-gray-100">
			<div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-1">
				<blockquote className="text-2xl font-medium text-center">
					<p className="text-lg font-semibold">Welcome to Casino powered by Ethereum</p>
				</blockquote>
				<div className="flex items-center mt-3 justify-center">
					<div className="text-2xl font-medium text-primary mt-4 mb-2 text-red-700">
						{errMessage === "" ? null : errMessage}
					</div>
				</div>
				<div className="text-primary m-6">
					<div className="flex items-center mt-3 justify-center">
						<h1 className="text-2xl font-medium text-primary mt-4 mb-2">
							Login to your account
						</h1>
					</div>
					<form onSubmit={handleSubmit}>
						<label className="text-left">Username</label>
						<input
							name="username"
							type="text"
							value={formData.user.username}
							onChange={handleChange}
							placeholder="username"
							className={
								"w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
							}
						/>
						<label>Password:</label>
						<input
							name="password"
							type="password"
							value={formData.user.password}
							onChange={handleChange}
							placeholder="Password"
							className={
								"w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
							}
						/>
						<div className="flex items-center mt-3 justify-center">
							<button
								className={
									"bg-blue-700 hover:bg-blue-500 py-2 px-4 text-md text-white rounded border border-blue focus:outline-none focus:border-black"
								}
								value="Login">
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</figure>
	);
}
