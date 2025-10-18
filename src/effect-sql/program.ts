import * as Effect from "effect/Effect";
import { NodeSdkLive } from "../node-sdk.js";
import { makeSimpleQuery, SqlLive } from "./db.js";

const program = makeSimpleQuery(12).pipe(
	Effect.provide(SqlLive),
	Effect.provide(NodeSdkLive),
);

Effect.runPromise(program);
