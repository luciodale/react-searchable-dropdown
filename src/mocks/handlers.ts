import { http, HttpResponse } from "msw";
import type { User } from "../features/api/userApi";

export const handlers = [
	http.get("/api/user", ({ request }) => {
		return HttpResponse.json<User>(
			{
				id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
				firstName: "John",
				lastName: "Maverick",
			},
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
				},
			},
		);
	}),
];
