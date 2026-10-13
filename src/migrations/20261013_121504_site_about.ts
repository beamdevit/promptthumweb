import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_about" (
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar DEFAULT 'ประวัติบริษัท' NOT NULL,
    "content" jsonb DEFAULT '{"root":{"type":"root","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"บริษัท พร้อมพ์ทำ จำกัด ก่อตั้งขึ้นจากความตั้งใจของทีมงานที่ต้องการนำความรู้และประสบการณ์ด้านการออกแบบกราฟิกและการตลาดออนไลน์ มาช่วยให้ธุรกิจสามารถสร้างภาพลักษณ์ที่ดีและสื่อสารกับกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ โดยเฉพาะธุรกิจขนาดเล็กและผู้ที่กำลังเริ่มต้นทำธุรกิจ","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"ในช่วงเริ่มต้น บริษัทมุ่งเน้นการให้บริการด้านงานออกแบบกราฟิกเป็นหลัก ก่อนที่จะพัฒนาการให้บริการให้ครอบคลุมมากยิ่งขึ้น ทั้งการออกแบบสื่อประชาสัมพันธ์ การออกแบบแบรนด์ดิ้ง การออกแบบเว็บไซต์ การทำคอนเทนต์ และการตลาดออนไลน์ เพื่อให้ลูกค้าสามารถวางแผนและดำเนินงานด้านการสื่อสารการตลาดได้อย่างครบวงจรภายใต้ทีมงานเดียว","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"ตลอดระยะเวลาการดำเนินงาน เราได้มีโอกาสร่วมงานกับธุรกิจหลากหลายประเภท ทำให้ทีมงานได้เรียนรู้และเข้าใจความต้องการที่แตกต่างกันของแต่ละธุรกิจ และนำประสบการณ์เหล่านั้นมาพัฒนากระบวนการทำงานให้มีความยืดหยุ่น ใส่ใจในรายละเอียด และสามารถออกแบบงานให้เหมาะสมกับเป้าหมายของลูกค้าแต่ละราย","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"ปัจจุบัน บริษัท พร้อมพ์ทำ จำกัด ยังคงมุ่งมั่นในการพัฒนางานออกแบบและการตลาดออนไลน์อย่างต่อเนื่อง พร้อมนำแนวคิดสร้างสรรค์ เทคโนโลยี และความเข้าใจด้านธุรกิจมาประยุกต์ใช้ในการทำงาน เพื่อสร้างผลงานที่ไม่ได้มุ่งเน้นเพียงความสวยงาม แต่สามารถนำไปใช้งานจริงและช่วยสนับสนุนการเติบโตของธุรกิจได้อย่างเหมาะสม","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"เราเชื่อว่าการออกแบบที่ดีไม่ควรเป็นเรื่องไกลตัวสำหรับธุรกิจใด ๆ และทุกธุรกิจควรมีโอกาสเข้าถึงงานออกแบบที่มีคุณภาพ เพื่อสร้างความน่าเชื่อถือ สื่อสารตัวตนของแบรนด์ และเติบโตไปพร้อมกับธุรกิจของตนเอง","detail":0,"format":0,"mode":"normal","style":""}]}]}}'::jsonb NOT NULL,
    "heading_en" varchar DEFAULT 'Our story',
    "content_en" jsonb DEFAULT '{"root":{"type":"root","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"Promptthum was founded by a team who wanted to use their experience in graphic design and digital marketing to help businesses build a strong identity and connect with their customers, especially small businesses and new entrepreneurs.","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"We began with graphic design and expanded into advertising, branding, websites, content and digital marketing, bringing complete marketing support together under one team.","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"Working with many different businesses has helped us understand their individual needs. We use that experience to develop a flexible, detail-focused process built around each client’s goals.","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"Today, we continue to develop our design and digital marketing services, combining creativity, technology and business understanding to create work that looks good, works in practice and supports business growth.","detail":0,"format":0,"mode":"normal","style":""}]},{"type":"paragraph","version":1,"direction":null,"format":"","indent":0,"children":[{"type":"text","version":1,"text":"We believe good design should be accessible to every business, helping brands build trust, express their identity and grow.","detail":0,"format":0,"mode":"normal","style":""}]}]}}'::jsonb,
    "eyebrow" varchar DEFAULT 'ABOUT US',
    "image_id" integer,
    "image_alt" varchar,
    "image_alt_en" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "site_about" ADD CONSTRAINT "site_about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_about_image_idx" ON "site_about" USING btree ("image_id");
  -- Seed the existing Thai and English copy so it is immediately editable.
  INSERT INTO "site_about" ("created_at", "updated_at") VALUES (now(), now());`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_about" CASCADE;`)
}
