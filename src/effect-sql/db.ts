import { SqlClient } from "@effect/sql";
import { PgClient } from "@effect/sql-pg";
import { Redacted } from "effect";
import * as Effect from "effect/Effect";

export const SqlLive = PgClient.layer({
	host: "localhost",
	port: 54320,
	database: "testdb",
	username: "postgres",
	password: Redacted.make("postgres"),
});

export const makeSimpleQuery = Effect.fn("Database.execute")(function* (input: number) {
	const sql = yield* SqlClient.SqlClient;

	const res = yield* sql`select ${input}`;

	yield* Effect.log("Got back ", res);
});
