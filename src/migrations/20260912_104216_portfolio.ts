import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_portfolio_category" AS ENUM('website', 'graphic', 'branding', 'ads', 'video', 'packaging');
  CREATE TABLE "portfolio_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "portfolio_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "portfolio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"category" "enum_portfolio_category" NOT NULL,
  	"client" varchar,
  	"year" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "portfolio_id" integer;
  ALTER TABLE "portfolio_gallery" ADD CONSTRAINT "portfolio_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_gallery" ADD CONSTRAINT "portfolio_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_tags" ADD CONSTRAINT "portfolio_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "portfolio_gallery_order_idx" ON "portfolio_gallery" USING btree ("_order");
  CREATE INDEX "portfolio_gallery_parent_id_idx" ON "portfolio_gallery" USING btree ("_parent_id");
  CREATE INDEX "portfolio_gallery_image_idx" ON "portfolio_gallery" USING btree ("image_id");
  CREATE INDEX "portfolio_tags_order_idx" ON "portfolio_tags" USING btree ("_order");
  CREATE INDEX "portfolio_tags_parent_id_idx" ON "portfolio_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "portfolio_slug_idx" ON "portfolio" USING btree ("slug");
  CREATE INDEX "portfolio_cover_idx" ON "portfolio" USING btree ("cover_id");
  CREATE INDEX "portfolio_updated_at_idx" ON "portfolio" USING btree ("updated_at");
  CREATE INDEX "portfolio_created_at_idx" ON "portfolio" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_portfolio_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "portfolio_gallery" CASCADE;
  DROP TABLE "portfolio_tags" CASCADE;
  DROP TABLE "portfolio" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_fk";
  
  DROP INDEX "payload_locked_documents_rels_portfolio_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "portfolio_id";
  DROP TYPE "public"."enum_portfolio_category";`)
}
