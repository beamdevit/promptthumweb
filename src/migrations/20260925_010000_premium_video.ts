import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_video" ADD COLUMN "video_url" varchar;
    ALTER TABLE "site_video" ADD COLUMN "poster_url" varchar;
    ALTER TABLE "site_video" ALTER COLUMN "youtube_url" SET DEFAULT 'https://www.youtube.com/watch?v=N7hJKEvta-U';
    UPDATE "site_video" SET "youtube_url" = 'https://www.youtube.com/watch?v=N7hJKEvta-U', "updated_at" = now();
  `)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_video" DROP COLUMN "video_url";
    ALTER TABLE "site_video" DROP COLUMN "poster_url";
    ALTER TABLE "site_video" ALTER COLUMN "youtube_url" SET DEFAULT 'https://www.youtube.com/shorts/VkhxFQPyGsg';
  `)
}
