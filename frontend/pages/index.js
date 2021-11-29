import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>Casino App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
		</div>
	);
}
