import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_visits_device" AS ENUM('mobile', 'tablet', 'desktop', 'other');
    CREATE TABLE "site_visits" (
      "id" serial PRIMARY KEY NOT NULL,
      "session_hash" varchar NOT NULL,
      "visitor_hash" varchar NOT NULL,
      "source" varchar NOT NULL,
      "device" "enum_site_visits_device" NOT NULL,
      "landing_path" varchar NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_visits_id" integer;
    CREATE UNIQUE INDEX "site_visits_session_hash_idx" ON "site_visits" USING btree ("session_hash");
    CREATE INDEX "site_visits_visitor_hash_idx" ON "site_visits" USING btree ("visitor_hash");
    CREATE INDEX "site_visits_created_at_idx" ON "site_visits" USING btree ("created_at");
    CREATE INDEX "site_visits_updated_at_idx" ON "site_visits" USING btree ("updated_at");
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_visits_fk" FOREIGN KEY ("site_visits_id") REFERENCES "public"."site_visits"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_site_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("site_visits_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_visits_fk";
    DROP INDEX "payload_locked_documents_rels_site_visits_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_visits_id";
    DROP TABLE "site_visits";
    DROP TYPE "public"."enum_site_visits_device";`)
}
