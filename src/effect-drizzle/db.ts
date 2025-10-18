import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { PgClient } from "@effect/sql-pg";
import { sql } from "drizzle-orm";
import { Effect, Layer, Redacted } from "effect";
import * as schema from "./schema.js";

export const SqlLive = PgClient.layer({
	host: "localhost",
	port: 54320,
	database: "testdb",
	username: "postgres",
	password: Redacted.make("postgres"),
});

export class Database extends Effect.Service<Database>()(
	"@template/basic/database.service/Database",
	{
		dependencies: [SqlLive],
		effect: Effect.gen(function* () {
			const db = yield* PgDrizzle.make<typeof schema>({ schema });

			return db;
		}),
	},
) {}

export const makeSimpleQuery = Effect.fn("Database.execute")(function* (
	input: number,
) {
	const db = yield* Database;

	const res = yield* db.execute(sql`select ${input}`);

	yield* Effect.log("Got back ", res);
});
