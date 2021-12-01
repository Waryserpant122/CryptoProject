import "./App.css";
import Login from "./components/Login";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouletteWheel from "./components/Wheel";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/game/:id" element={<RouletteWheel />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
