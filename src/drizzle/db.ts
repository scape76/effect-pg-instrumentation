import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Effect } from "effect";
import * as pg from "pg";

export class Database extends Effect.Service<Database>()(
	"@template/basic/database.service/Database",
	{
		effect: Effect.gen(function* () {
			const pool = yield* Effect.sync(
				() =>
					new pg.Pool({
						host: "localhost",
						port: 54320,
						database: "testdb",
						user: "postgres",
						password: "postgres",
					}),
			);

			const db = drizzle(pool);

			return db;
		}),
	},
) {}

export const makeSimpleQuery = Effect.fn("Database.execute")(function* (
	input: number,
) {
	const db = yield* Database;

	const res = db.execute(sql`select ${input}`);

	yield* Effect.log("Got back ", res);
});
