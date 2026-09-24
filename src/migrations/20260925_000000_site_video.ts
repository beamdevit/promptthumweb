import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "site_video" (
      "id" serial PRIMARY KEY NOT NULL,
      "youtube_url" varchar DEFAULT 'https://www.youtube.com/shorts/VkhxFQPyGsg' NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "site_video" ("youtube_url", "updated_at", "created_at")
    VALUES ('https://www.youtube.com/shorts/VkhxFQPyGsg', now(), now());
  `)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE "site_video";`)
}
