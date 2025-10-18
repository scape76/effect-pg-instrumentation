import * as Effect from "effect/Effect";
import { NodeSdkLive } from "../node-sdk.js";
import { Database, makeSimpleQuery } from "./db.js";

const program = makeSimpleQuery(123).pipe(
	Effect.provide(Database.Default),
	Effect.provide(NodeSdkLive),
);

Effect.runPromise(program);
