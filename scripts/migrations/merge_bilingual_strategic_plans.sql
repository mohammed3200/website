-- ============================================================================
-- Migration: Merge duplicated StrategicPlan rows into unified bilingual rows
-- ============================================================================
-- Context: The StrategicPlan table was designed for bilingual storage
-- (EN+AR in one row) but the seed/app created TWO rows per plan:
--   - Arabic row:  slug like '...-ar-1', '...-ar-2'
--   - English row: slug like '...-en-1', '...-en-2'
--
-- This migration merges Arabic data INTO the English row, then deletes
-- the redundant Arabic-only rows.
--
-- WARNING: ALWAYS TAKE A FULL BACKUP BEFORE RUNNING THIS MIGRATION.
-- ============================================================================

-- Step 0: Diagnostic — show current state (run this FIRST to verify pairs)
SELECT
  id,
  slug,
  title,
  titleAr,
  LEFT(content, 50) AS content_preview,
  LEFT(contentAr, 50) AS contentAr_preview
FROM StrategicPlan
WHERE slug LIKE '%-ar-%' OR slug LIKE '%-en-%'
ORDER BY slug;

-- Step 1: Merge Arabic content into the English rows
-- Match by the numeric ID suffix: '-ar-1' pairs with '-en-1'
UPDATE StrategicPlan en_row
INNER JOIN StrategicPlan ar_row
  ON SUBSTRING_INDEX(en_row.slug, '-en-', -1) = SUBSTRING_INDEX(ar_row.slug, '-ar-', -1)
  AND en_row.slug LIKE '%-en-%'
  AND ar_row.slug LIKE '%-ar-%'
SET
  en_row.titleAr    = COALESCE(ar_row.titleAr, ar_row.title),
  en_row.contentAr  = COALESCE(ar_row.contentAr, ar_row.content),
  en_row.excerptAr  = COALESCE(ar_row.excerptAr, ar_row.excerpt),
  en_row.categoryAr = COALESCE(ar_row.categoryAr, ar_row.category, 'خطة استراتيجية');

-- Step 2: Rename English row slugs to language-neutral format
UPDATE StrategicPlan
SET slug = CONCAT('strategic-plan-', SUBSTRING_INDEX(slug, '-en-', -1))
WHERE slug LIKE '%-en-%';

-- Step 3: Delete only the Arabic-only rows that successfully merged with an English counterpart
DELETE ar_row FROM StrategicPlan ar_row
INNER JOIN StrategicPlan en_row
  ON SUBSTRING_INDEX(en_row.slug, '-en-', -1) = SUBSTRING_INDEX(ar_row.slug, '-ar-', -1)
  AND en_row.slug LIKE '%-en-%'
WHERE ar_row.slug LIKE '%-ar-%';

-- Step 4: Verify — each plan should now have both EN and AR data
SELECT
  id,
  slug,
  title,
  titleAr,
  LEFT(content, 50) AS content_preview,
  LEFT(contentAr, 50) AS contentAr_preview,
  excerpt,
  excerptAr,
  category,
  categoryAr
FROM StrategicPlan
ORDER BY slug;
