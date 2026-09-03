import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_article_type" AS ENUM('nyhet', 'infor', 'referat', 'spelarbetyg', 'kronika', 'foreningen', 'intervju');
  CREATE TYPE "public"."enum__posts_v_version_article_type" AS ENUM('nyhet', 'infor', 'referat', 'spelarbetyg', 'kronika', 'foreningen', 'intervju');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('sv', 'en');
  CREATE TYPE "public"."enum_matches_team" AS ENUM('herrar', 'damer', 'akademin');
  CREATE TYPE "public"."enum_matches_home_or_away" AS ENUM('home', 'away', 'neutral');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('pubkvall', 'resa', 'arsmote', 'traff', 'annat');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('sv', 'en');
  CREATE TYPE "public"."enum_members_status" AS ENUM('pending', 'active', 'expired', 'cancelled');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('sv', 'en');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TYPE "public"."enum_matches_competition" ADD VALUE 'europa-league' BEFORE 'fa-cup';
  ALTER TYPE "public"."enum_matches_competition" ADD VALUE 'wsl' BEFORE 'friendly';
  ALTER TYPE "public"."enum_events_event_type" ADD VALUE 'traff' BEFORE 'annat';
  ALTER TYPE "public"."enum_site_settings_social_links_platform" ADD VALUE 'tiktok' BEFORE 'other';
  ALTER TYPE "public"."enum_site_settings_social_links_platform" ADD VALUE 'discord' BEFORE 'other';
  ALTER TYPE "public"."enum_site_settings_social_links_platform" ADD VALUE 'spotify' BEFORE 'other';
  CREATE TABLE "_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_featured_image_id" integer,
  	"version_excerpt" varchar,
  	"version_article_type" "enum__posts_v_version_article_type" DEFAULT 'nyhet',
  	"version_category_id" integer,
  	"version_related_match_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "matches_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"venues_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_event_type" "enum__events_v_version_event_type" DEFAULT 'pubkvall',
  	"version_city" varchar,
  	"version_location" varchar,
  	"version_description" jsonb,
  	"version_featured_image_id" integer,
  	"version_max_attendees" numeric,
  	"version_registration_link" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"address" varchar,
  	"description" varchar,
  	"contact_name" varchar,
  	"contact_email" varchar,
  	"maps_url" varchar,
  	"image_id" integer,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_facts_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_facts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  ALTER TABLE "posts" RENAME COLUMN "status" TO "_status";
  ALTER TABLE "pages" RENAME COLUMN "status" TO "_status";
  ALTER TABLE "matches" DROP CONSTRAINT "matches_match_report_post_id_posts_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_featured_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_next_match_override_id_matches_id_fk";
  
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DATA TYPE text;
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum_members_membership_type";
  CREATE TYPE "public"."enum_members_membership_type" AS ENUM('standard', 'familj', 'ungdom', 'heders');
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DEFAULT 'standard'::"public"."enum_members_membership_type";
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DATA TYPE "public"."enum_members_membership_type" USING "membership_type"::"public"."enum_members_membership_type";
  DROP INDEX "matches_match_report_post_idx";
  DROP INDEX "pages_featured_image_idx";
  DROP INDEX "site_settings_next_match_override_idx";
  ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "posts_tags" ALTER COLUMN "tag" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "featured_image_id" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "author_id" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "seo_meta_title" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "seo_meta_description" DROP NOT NULL;
  ALTER TABLE "matches" ALTER COLUMN "venue" DROP NOT NULL;
  ALTER TABLE "matches" ALTER COLUMN "competition" SET DEFAULT 'premier-league';
  ALTER TABLE "events" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "location" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "event_type" SET DEFAULT 'pubkvall';
  ALTER TABLE "events" ALTER COLUMN "event_type" DROP NOT NULL;
  ALTER TABLE "members" ALTER COLUMN "expires_at" DROP NOT NULL;
  ALTER TABLE "pages_blocks_rich_text_block" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "pages_blocks_image_block" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "seo_meta_title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "seo_meta_description" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "show_in_team" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "title" varchar;
  ALTER TABLE "users" ADD COLUMN "bio" varchar;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "supporter_since" numeric;
  ALTER TABLE "posts" ADD COLUMN "article_type" "enum_posts_article_type" DEFAULT 'nyhet';
  ALTER TABLE "posts" ADD COLUMN "related_match_id" integer;
  ALTER TABLE "posts" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "matches" ADD COLUMN "team" "enum_matches_team" DEFAULT 'herrar' NOT NULL;
  ALTER TABLE "matches" ADD COLUMN "home_or_away" "enum_matches_home_or_away" DEFAULT 'home' NOT NULL;
  ALTER TABLE "matches" ADD COLUMN "result_chelsea_goals" numeric;
  ALTER TABLE "matches" ADD COLUMN "result_opponent_goals" numeric;
  ALTER TABLE "matches" ADD COLUMN "tv_channel" varchar;
  ALTER TABLE "events" ADD COLUMN "slug" varchar;
  ALTER TABLE "events" ADD COLUMN "city" varchar;
  ALTER TABLE "events" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "_status" "enum_events_status" DEFAULT 'draft';
  ALTER TABLE "members" ADD COLUMN "status" "enum_members_status" DEFAULT 'pending' NOT NULL;
  ALTER TABLE "members" ADD COLUMN "city" varchar;
  ALTER TABLE "members" ADD COLUMN "message" varchar;
  ALTER TABLE "members" ADD COLUMN "newsletter" boolean DEFAULT false;
  ALTER TABLE "members" ADD COLUMN "notes" varchar;
  ALTER TABLE "pages" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "venues_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar DEFAULT 'Sveriges Chelsea-supportrar sedan 1991';
  ALTER TABLE "site_settings" ADD COLUMN "description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "email" varchar DEFAULT 'info@chelseasweden.se';
  ALTER TABLE "site_settings" ADD COLUMN "org_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "membership_fee" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "swish" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "bankgiro" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "show_chelsea_news" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "show_podcast" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "show_svenska_fans" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "forum_url" varchar DEFAULT 'https://www.svenskafans.com/fotboll/lag/chelsea/forum';
  ALTER TABLE "site_settings" ADD COLUMN "podcast_url" varchar DEFAULT 'https://open.spotify.com/show/5Jk5cKJ90z2QPlj0CDtWBK';
  ALTER TABLE "site_settings" ADD COLUMN "fpl_league_url" varchar;
  ALTER TABLE "navigation_items_children" ADD COLUMN "external" boolean DEFAULT false;
  ALTER TABLE "navigation_items" ADD COLUMN "external" boolean DEFAULT false;
  ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_related_match_id_matches_id_fk" FOREIGN KEY ("version_related_match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_rels" ADD CONSTRAINT "matches_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches_rels" ADD CONSTRAINT "matches_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts_block_items" ADD CONSTRAINT "pages_blocks_facts_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_facts_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts_block" ADD CONSTRAINT "pages_blocks_facts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_block" ADD CONSTRAINT "pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_items" ADD CONSTRAINT "pages_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_block_items" ADD CONSTRAINT "_pages_v_blocks_facts_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_facts_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_block" ADD CONSTRAINT "_pages_v_blocks_facts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_block" ADD CONSTRAINT "_pages_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block_items" ADD CONSTRAINT "_pages_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_related_match_idx" ON "_posts_v" USING btree ("version_related_match_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "matches_rels_order_idx" ON "matches_rels" USING btree ("order");
  CREATE INDEX "matches_rels_parent_idx" ON "matches_rels" USING btree ("parent_id");
  CREATE INDEX "matches_rels_path_idx" ON "matches_rels" USING btree ("path");
  CREATE INDEX "matches_rels_venues_id_idx" ON "matches_rels" USING btree ("venues_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_featured_image_idx" ON "_events_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "venues_slug_idx" ON "venues" USING btree ("slug");
  CREATE INDEX "venues_image_idx" ON "venues" USING btree ("image_id");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX "pages_blocks_facts_block_items_order_idx" ON "pages_blocks_facts_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_block_items_parent_id_idx" ON "pages_blocks_facts_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_block_order_idx" ON "pages_blocks_facts_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_block_parent_id_idx" ON "pages_blocks_facts_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_block_path_idx" ON "pages_blocks_facts_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_block_order_idx" ON "pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_block_parent_id_idx" ON "pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_block_path_idx" ON "pages_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_block_items_order_idx" ON "pages_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_items_parent_id_idx" ON "pages_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_block_order_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_block_parent_id_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_path_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_block_order_idx" ON "_pages_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_block_parent_id_idx" ON "_pages_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_block_path_idx" ON "_pages_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_block_image_idx" ON "_pages_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_facts_block_items_order_idx" ON "_pages_v_blocks_facts_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_block_items_parent_id_idx" ON "_pages_v_blocks_facts_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_block_order_idx" ON "_pages_v_blocks_facts_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_block_parent_id_idx" ON "_pages_v_blocks_facts_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_block_path_idx" ON "_pages_v_blocks_facts_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_block_order_idx" ON "_pages_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_block_parent_id_idx" ON "_pages_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_block_path_idx" ON "_pages_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_block_items_order_idx" ON "_pages_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_items_parent_id_idx" ON "_pages_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_related_match_id_matches_id_fk" FOREIGN KEY ("related_match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "posts_related_match_idx" ON "posts" USING btree ("related_match_id");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  ALTER TABLE "matches" DROP COLUMN "result_home_goals";
  ALTER TABLE "matches" DROP COLUMN "result_away_goals";
  ALTER TABLE "matches" DROP COLUMN "match_report";
  ALTER TABLE "matches" DROP COLUMN "match_report_post_id";
  ALTER TABLE "members" DROP COLUMN "active";
  ALTER TABLE "pages" DROP COLUMN "featured_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "footer_text";
  ALTER TABLE "site_settings" DROP COLUMN "next_match_override_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_posts_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "matches_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_facts_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_facts_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_facts_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_facts_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_posts_v_version_tags" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "matches_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "pages_blocks_facts_block_items" CASCADE;
  DROP TABLE "pages_blocks_facts_block" CASCADE;
  DROP TABLE "pages_blocks_cta_block" CASCADE;
  DROP TABLE "pages_blocks_faq_block_items" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_block" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_related_match_id_matches_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_venues_fk";
  
  ALTER TABLE "matches" ALTER COLUMN "competition" SET DATA TYPE text;
  DROP TYPE "public"."enum_matches_competition";
  CREATE TYPE "public"."enum_matches_competition" AS ENUM('premier-league', 'champions-league', 'fa-cup', 'efl-cup', 'friendly', 'other');
  ALTER TABLE "matches" ALTER COLUMN "competition" SET DATA TYPE "public"."enum_matches_competition" USING "competition"::"public"."enum_matches_competition";
  ALTER TABLE "events" ALTER COLUMN "event_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_events_event_type";
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('pubkvall', 'resa', 'arsmote', 'annat');
  ALTER TABLE "events" ALTER COLUMN "event_type" SET DATA TYPE "public"."enum_events_event_type" USING "event_type"::"public"."enum_events_event_type";
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DATA TYPE text;
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum_members_membership_type";
  CREATE TYPE "public"."enum_members_membership_type" AS ENUM('standard', 'premium', 'ungdom');
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DEFAULT 'standard'::"public"."enum_members_membership_type";
  ALTER TABLE "members" ALTER COLUMN "membership_type" SET DATA TYPE "public"."enum_members_membership_type" USING "membership_type"::"public"."enum_members_membership_type";
  ALTER TABLE "site_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('facebook', 'instagram', 'x', 'youtube', 'other');
  ALTER TABLE "site_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_site_settings_social_links_platform" USING "platform"::"public"."enum_site_settings_social_links_platform";
  DROP INDEX "users_avatar_idx";
  DROP INDEX "posts_related_match_idx";
  DROP INDEX "posts__status_idx";
  DROP INDEX "events_slug_idx";
  DROP INDEX "events__status_idx";
  DROP INDEX "pages_hero_image_idx";
  DROP INDEX "pages__status_idx";
  DROP INDEX "payload_locked_documents_rels_venues_id_idx";
  ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "posts_tags" ALTER COLUMN "tag" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "featured_image_id" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "seo_meta_title" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "seo_meta_description" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "author_id" SET NOT NULL;
  ALTER TABLE "matches" ALTER COLUMN "competition" DROP DEFAULT;
  ALTER TABLE "matches" ALTER COLUMN "venue" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "event_type" DROP DEFAULT;
  ALTER TABLE "events" ALTER COLUMN "event_type" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "location" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "members" ALTER COLUMN "expires_at" SET NOT NULL;
  ALTER TABLE "pages_blocks_rich_text_block" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "pages_blocks_image_block" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "seo_meta_title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "seo_meta_description" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "status" "enum_posts_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "matches" ADD COLUMN "result_home_goals" numeric;
  ALTER TABLE "matches" ADD COLUMN "result_away_goals" numeric;
  ALTER TABLE "matches" ADD COLUMN "match_report" jsonb;
  ALTER TABLE "matches" ADD COLUMN "match_report_post_id" integer;
  ALTER TABLE "members" ADD COLUMN "active" boolean DEFAULT true NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "status" "enum_pages_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "footer_text" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "next_match_override_id" integer;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_match_report_post_id_posts_id_fk" FOREIGN KEY ("match_report_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_next_match_override_id_matches_id_fk" FOREIGN KEY ("next_match_override_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "matches_match_report_post_idx" ON "matches" USING btree ("match_report_post_id");
  CREATE INDEX "pages_featured_image_idx" ON "pages" USING btree ("featured_image_id");
  CREATE INDEX "site_settings_next_match_override_idx" ON "site_settings" USING btree ("next_match_override_id");
  ALTER TABLE "users" DROP COLUMN "show_in_team";
  ALTER TABLE "users" DROP COLUMN "title";
  ALTER TABLE "users" DROP COLUMN "bio";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users" DROP COLUMN "supporter_since";
  ALTER TABLE "posts" DROP COLUMN "article_type";
  ALTER TABLE "posts" DROP COLUMN "related_match_id";
  ALTER TABLE "posts" DROP COLUMN "featured";
  ALTER TABLE "posts" DROP COLUMN "_status";
  ALTER TABLE "matches" DROP COLUMN "team";
  ALTER TABLE "matches" DROP COLUMN "home_or_away";
  ALTER TABLE "matches" DROP COLUMN "result_chelsea_goals";
  ALTER TABLE "matches" DROP COLUMN "result_opponent_goals";
  ALTER TABLE "matches" DROP COLUMN "tv_channel";
  ALTER TABLE "events" DROP COLUMN "slug";
  ALTER TABLE "events" DROP COLUMN "city";
  ALTER TABLE "events" DROP COLUMN "featured";
  ALTER TABLE "events" DROP COLUMN "_status";
  ALTER TABLE "members" DROP COLUMN "status";
  ALTER TABLE "members" DROP COLUMN "city";
  ALTER TABLE "members" DROP COLUMN "message";
  ALTER TABLE "members" DROP COLUMN "newsletter";
  ALTER TABLE "members" DROP COLUMN "notes";
  ALTER TABLE "pages" DROP COLUMN "intro";
  ALTER TABLE "pages" DROP COLUMN "hero_image_id";
  ALTER TABLE "pages" DROP COLUMN "_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "venues_id";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "description";
  ALTER TABLE "site_settings" DROP COLUMN "email";
  ALTER TABLE "site_settings" DROP COLUMN "org_number";
  ALTER TABLE "site_settings" DROP COLUMN "membership_fee";
  ALTER TABLE "site_settings" DROP COLUMN "swish";
  ALTER TABLE "site_settings" DROP COLUMN "bankgiro";
  ALTER TABLE "site_settings" DROP COLUMN "show_chelsea_news";
  ALTER TABLE "site_settings" DROP COLUMN "show_podcast";
  ALTER TABLE "site_settings" DROP COLUMN "show_svenska_fans";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_text";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_label";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_url";
  ALTER TABLE "site_settings" DROP COLUMN "forum_url";
  ALTER TABLE "site_settings" DROP COLUMN "podcast_url";
  ALTER TABLE "site_settings" DROP COLUMN "fpl_league_url";
  ALTER TABLE "navigation_items_children" DROP COLUMN "external";
  ALTER TABLE "navigation_items" DROP COLUMN "external";
  DROP TYPE "public"."enum_posts_article_type";
  DROP TYPE "public"."enum__posts_v_version_article_type";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_matches_team";
  DROP TYPE "public"."enum_matches_home_or_away";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_members_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
