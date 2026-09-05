import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Två fält för texter som flyttats hit utifrån: skribentens namn när personen
 * inte har ett konto här, och länken dit texten först publicerades. Behövs för
 * importen av föreningens egna artiklar från SvenskaFans.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "byline" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source_url" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_byline" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_source_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "byline";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "source_url";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_byline";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_source_url";
  `)
}
