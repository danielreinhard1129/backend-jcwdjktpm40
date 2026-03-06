import { Pool } from "pg";

export const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_Vz68wGOEvQHt@ep-blue-bonus-a138dxpq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});
