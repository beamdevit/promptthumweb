import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_url" varchar,
  	"line_qr_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_contact" ADD CONSTRAINT "site_contact_line_qr_id_media_id_fk" FOREIGN KEY ("line_qr_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_contact_line_qr_idx" ON "site_contact" USING btree ("line_qr_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_contact" CASCADE;`)
}
