import { Global, Module, OnApplicationShutdown, Inject } from "@nestjs/common";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { getEnv } from "../config/env.schema.js";

export const DB_WRITE = Symbol("DB_WRITE");
export const DB_READ = Symbol("DB_READ");

export interface DbConnection {
  db: PostgresJsDatabase<typeof schema>;
  sqlClient: postgres.Sql;
}

@Global()
@Module({
  providers: [
    {
      provide: DB_WRITE,
      useFactory: (): DbConnection => {
        const env = getEnv();
        // prepare: false is mandatory for PgBouncer transaction pooling mode
        // statement_timeout: 5000 enforces server-level statement termination (§4.3)
        const sqlClient = postgres(env.DATABASE_WRITE_URL, {
          max: env.DATABASE_POOL_MAX,
          idle_timeout: 20,
          connect_timeout: 5,
          prepare: false,
          connection: {
            statement_timeout: 5000
          }
        });
        return { db: drizzle(sqlClient, { schema }), sqlClient };
      }
    },
    {
      provide: DB_READ,
      useFactory: (): DbConnection => {
        const env = getEnv();
        const sqlClient = postgres(env.DATABASE_READ_URL, {
          max: env.DATABASE_POOL_MAX,
          idle_timeout: 20,
          connect_timeout: 5,
          prepare: false,
          connection: {
            statement_timeout: 5000
          }
        });
        return { db: drizzle(sqlClient, { schema }), sqlClient };
      }
    }
  ],
  exports: [DB_WRITE, DB_READ]
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(DB_WRITE) private readonly writeConn: DbConnection,
    @Inject(DB_READ) private readonly readConn: DbConnection
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([
      this.writeConn.sqlClient.end({ timeout: 5 }),
      this.readConn.sqlClient.end({ timeout: 5 })
    ]);
  }
}

