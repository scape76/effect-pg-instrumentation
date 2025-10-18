import {
	HttpApi,
	HttpApiBuilder,
	HttpApiEndpoint,
	HttpApiGroup,
	HttpServer,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer, Schema } from "effect";
import { NodeSdkLive } from "../node-sdk.js";
import { Database, makeSimpleQuery } from "./db.js";

// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const MyApi = HttpApi.make("MyApi").add(
	HttpApiGroup.make("Greetings").add(
		HttpApiEndpoint.get("hello-world")`/`.addSuccess(Schema.String),
	),
);

// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(MyApi, "Greetings", (handlers) =>
	handlers.handle("hello-world", () =>
		makeSimpleQuery(10).pipe(
			Effect.map(() => "hello"),
			Effect.orDie,
		),
	),
).pipe(Layer.provide(Database.Default));

// Provide the implementation for the API
const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive));

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpApiBuilder.serve().pipe(
	Layer.provide(NodeSdkLive),
	Layer.provide(MyApiLive),
	HttpServer.withLogAddress,
	Layer.provide(BunHttpServer.layer({ port: 3001 })),
);

// Launch the server
Layer.launch(ServerLive).pipe(BunRuntime.runMain);
