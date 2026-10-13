import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { contentSlug } from '../lib/content-slug'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "article_categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "order" numeric DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "portfolio_categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "order" numeric DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "articles" ADD COLUMN "category_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "portfolio" ADD COLUMN "category_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "article_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "portfolio_categories_id" integer;
  CREATE UNIQUE INDEX "article_categories_name_idx" ON "article_categories" USING btree ("name");
  CREATE UNIQUE INDEX "article_categories_slug_idx" ON "article_categories" USING btree ("slug");
  CREATE INDEX "article_categories_updated_at_idx" ON "article_categories" USING btree ("updated_at");
  CREATE INDEX "article_categories_created_at_idx" ON "article_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "portfolio_categories_name_idx" ON "portfolio_categories" USING btree ("name");
  CREATE UNIQUE INDEX "portfolio_categories_slug_idx" ON "portfolio_categories" USING btree ("slug");
  CREATE INDEX "portfolio_categories_updated_at_idx" ON "portfolio_categories" USING btree ("updated_at");
  CREATE INDEX "portfolio_categories_created_at_idx" ON "portfolio_categories" USING btree ("created_at");
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_article_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_article_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_category_id_portfolio_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_categories_fk" FOREIGN KEY ("article_categories_id") REFERENCES "public"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_categories_fk" FOREIGN KEY ("portfolio_categories_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "portfolio_category_idx" ON "portfolio" USING btree ("category_id");
  CREATE INDEX "payload_locked_documents_rels_article_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("article_categories_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_categories_id");`)

  // Include version-only labels so restoring an old article retains its category.
  const { rows } = await db.execute(sql`
    SELECT DISTINCT name FROM (
      SELECT COALESCE(NULLIF(btrim(category), ''), 'บทความ') AS name FROM articles
      UNION SELECT COALESCE(NULLIF(btrim(version_category), ''), 'บทความ') FROM _articles_v
      UNION SELECT 'บทความ'
    ) names ORDER BY name`)
  const usedSlugs = new Set<string>()
  for (const row of rows) {
    const name = String(row.name)
    const base = contentSlug(name) || 'category'
    let slug = base
    let suffix = 1
    while (usedSlugs.has(slug)) {
      const tail = `-${++suffix}`
      slug = base.slice(0, 120 - tail.length) + tail
    }
    usedSlugs.add(slug)
    await db.execute(sql`INSERT INTO article_categories (name, slug) VALUES (${name}, ${slug})`)
  }
  await db.execute(sql`
    INSERT INTO portfolio_categories (name, slug, "order") VALUES
      ('เว็บไซต์', 'website', 0), ('กราฟิกดีไซน์', 'graphic', 1),
      ('โลโก้ / CI', 'branding', 2), ('Ads Banner', 'ads', 3),
      ('วิดีโอ', 'video', 4), ('Packaging', 'packaging', 5);
    UPDATE articles a SET category_id = c.id FROM article_categories c
      WHERE c.name = COALESCE(NULLIF(btrim(a.category), ''), 'บทความ');
    UPDATE _articles_v v SET version_category_id = c.id FROM article_categories c
      WHERE c.name = COALESCE(NULLIF(btrim(v.version_category), ''), 'บทความ');
    UPDATE portfolio p SET category_id = c.id FROM portfolio_categories c WHERE c.slug = p.category::text;
    ALTER TABLE portfolio ALTER COLUMN category_id SET NOT NULL;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM articles WHERE category_id IS NULL)
        OR EXISTS (SELECT 1 FROM _articles_v WHERE version_category_id IS NULL) THEN
        RAISE EXCEPTION 'Category migration did not map all article categories';
      END IF;
    END $$;
    -- Only remove the legacy columns once every content row has been mapped.
  ALTER TABLE "articles" DROP COLUMN "category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category";
  ALTER TABLE "portfolio" DROP COLUMN "category";
  DROP TYPE "public"."enum_portfolio_category";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- The previous schema cannot represent newly added portfolio categories.
    -- Refuse this rollback instead of silently changing content classifications.
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM portfolio p JOIN portfolio_categories c ON c.id = p.category_id
        WHERE c.slug NOT IN ('website', 'graphic', 'branding', 'ads', 'video', 'packaging')) THEN
        RAISE EXCEPTION 'Move custom portfolio categories to legacy categories before rolling back';
      END IF;
    END $$;
    CREATE TYPE "public"."enum_portfolio_category" AS ENUM('website', 'graphic', 'branding', 'ads', 'video', 'packaging');
    ALTER TABLE "articles" ADD COLUMN "category" varchar DEFAULT 'บทความ';
    ALTER TABLE "_articles_v" ADD COLUMN "version_category" varchar DEFAULT 'บทความ';
    ALTER TABLE "portfolio" ADD COLUMN "category" "enum_portfolio_category";
    UPDATE articles a SET category = c.name FROM article_categories c WHERE c.id = a.category_id;
    UPDATE _articles_v v SET version_category = c.name FROM article_categories c WHERE c.id = v.version_category_id;
    UPDATE portfolio p SET category = c.slug::enum_portfolio_category FROM portfolio_categories c WHERE c.id = p.category_id;
    ALTER TABLE portfolio ALTER COLUMN category SET NOT NULL;
  ALTER TABLE "articles" DROP CONSTRAINT "articles_category_id_article_categories_id_fk";

  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_category_id_article_categories_id_fk";

  ALTER TABLE "portfolio" DROP CONSTRAINT "portfolio_category_id_portfolio_categories_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_article_categories_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_categories_fk";

  DROP INDEX "articles_category_idx";
  DROP INDEX "_articles_v_version_version_category_idx";
  DROP INDEX "portfolio_category_idx";
  DROP INDEX "payload_locked_documents_rels_article_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_portfolio_categories_id_idx";
  ALTER TABLE "articles" DROP COLUMN "category_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category_id";
  ALTER TABLE "portfolio" DROP COLUMN "category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "article_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "portfolio_categories_id";
  DROP TABLE "article_categories";
  DROP TABLE "portfolio_categories";`)
}
