import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_page" DROP CONSTRAINT "contact_page_map_image_id_media_id_fk";
  
  DROP INDEX "contact_page_map_map_image_idx";
  ALTER TABLE "site_settings" ADD COLUMN "map_location" varchar;
  ALTER TABLE "contact_page" DROP COLUMN "map_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "map_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_page" ADD COLUMN "map_image_id" integer NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "map_url" varchar;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contact_page_map_map_image_idx" ON "contact_page" USING btree ("map_image_id");
  ALTER TABLE "site_settings" DROP COLUMN "map_location";`)
}
