"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Launch {
	flight_number: number;
	name: string;
	date_utc: string;
  details?: string;
  upcoming: boolean;
  success?: boolean;
  links?: {
    article?: string;
    webcast?: string;
  };
}

const PAGE_SIZE = 10;

export default function Page() {
	const [launches, setLaunches] = useState<Launch[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const observerRef = useRef<HTMLDivElement | null>(null);

	const cache = useRef<Map<number, Launch[]>>(new Map());

	useEffect(() => {
		const fetchLaunches = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					"https://api.spacexdata.com/v5/launches/query",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query: searchTerm ? { name: { $regex: searchTerm, $options: "i" } } : {},
							options: {
								limit: PAGE_SIZE,
								page: searchTerm ? 1 : page,
								sort: { date_utc: "desc" },
							},
						}),
					}
				);
				const { docs } = await res.json();

				if (searchTerm) {
					setLaunches(docs);
				} else {
					cache.current.set(page, docs);
					setLaunches((prev) => [...prev, ...docs]);
				}
			} catch (error) {
				console.error("Error fetching launches:", error);
			}
			setLoading(false);
		};

		fetchLaunches();
	}, [page, searchTerm]);

	useEffect(() => {
		if (!observerRef.current || searchTerm) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading) {
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 1.0 }
		);

		observer.observe(observerRef.current);

		return () => observer.disconnect();
	}, [loading, searchTerm]);

	const getYearsAgo = (dateString: string) => {
		const launchDate = new Date(dateString);
		const diff = new Date().getFullYear() - launchDate.getFullYear();
		return diff > 0 ? `${diff} years ago` : "This year";
	};

	return (
		<div className="p-6 max-w-3xl mx-auto min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center text-gray-800">SpaceX Launches</h1>
			<input
				type="text"
				placeholder="Search launches..."
				className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value);
					setPage(1);
					setLaunches([]);
				}}
			/>
			<ul className="space-y-6">
				{launches.map((launch, index) => (
					<li
						key={`${launch.flight_number}_${launch.name}_${index}`}
						className="p-5 border border-gray-300 rounded-lg shadow bg-white hover:shadow-lg transition"
					>
						<div className="collapse collapse-arrow">
							<input type="checkbox" />
							<div className="collapse-title font-semibold flex justify-between items-center">
								<div>
									<h2 className="text-xl font-semibold text-gray-700">{launch.name}</h2>
									<p className="text-gray-500 text-sm">
										Launch Date: {new Date(launch.date_utc).toLocaleDateString()} ({getYearsAgo(launch.date_utc)})
									</p>
								</div>
								<p className={launch.upcoming ? "text-blue-500" : launch.success === null ? "text-gray-500" : launch.success ? "text-green-500" : "text-red-500"}>
									{launch.upcoming ? "Upcoming" : launch.success === null ? "Status Unknown" : launch.success ? "Success" : "Failed"}
								</p>
							</div>
							<div className="collapse-content text-gray-600 space-y-3">
								<p>{launch.details ? launch.details : "No details available."}</p>
								{launch.links?.article && (
									<p>
										<Link href={launch.links.article} className="text-blue-600 hover:underline" target="_blank">
											Read Article
										</Link>
									</p>
								)}
								{launch.links?.webcast && (
									<p>
										<Link href={launch.links.webcast} className="text-blue-600 hover:underline" target="_blank">
											Watch Video
										</Link>
									</p>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
			{loading && <div className="flex justify-center items-center w-full"><span className="loading loading-dots loading-xl"/></div>}
			<div ref={observerRef} className="h-10" />
		</div>
	);
}