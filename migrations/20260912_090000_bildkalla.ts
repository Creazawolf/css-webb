import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Bildens ursprungliga adress.
 *
 * Importen kände tidigare igen en redan hämtad bild på rubriken, och eftersom
 * rubriker som "Spelarbetyg: Chelsea – Leeds" återkommer mellan säsonger fick
 * den nyare artikeln den äldres bild. Adressen är unik per bild och är det
 * enda som duger som nyckel.
 *
 * Media har ingen versionshantering, så bara en tabell berörs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "source_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "source_url";
  `)
}
