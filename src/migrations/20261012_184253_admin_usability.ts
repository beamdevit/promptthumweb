import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_video" ALTER COLUMN "youtube_url" DROP NOT NULL;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_video" SET "youtube_url" = DEFAULT WHERE "youtube_url" IS NULL;
   ALTER TABLE "site_video" ALTER COLUMN "youtube_url" SET NOT NULL;`)
}
