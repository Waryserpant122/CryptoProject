import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();
	const { id } = router.query;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>Casino App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex items-center justify-center">The UserId is {id}</div>
		</div>
	);
}
