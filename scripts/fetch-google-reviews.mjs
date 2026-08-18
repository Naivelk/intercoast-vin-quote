/**
 * Trae las reseñas reales de Google de ambas oficinas, filtra solo las
 * positivas (4-5 estrellas) y genera public/data/google-reviews.json.
 *
 * Uso: node scripts/fetch-google-reviews.mjs
 * Requiere VITE_GOOGLE_PLACES_API_KEY en .env
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Cargar .env manualmente si existe (local); en CI se usa process.env directamente
function loadDotEnv() {
  const envPath = join(rootDir, '.env');
  try {
    const content = readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
    }
    return env;
  } catch {
    return {};
  }
}

const dotEnv = loadDotEnv();
const API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY || dotEnv.VITE_GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('Falta VITE_GOOGLE_PLACES_API_KEY (en .env local o en el secreto de GitHub Actions)');
  process.exit(1);
}

const OFFICES = [
  { id: 'south-gate', name: 'South Gate', placeId: 'ChIJb3N6c7rNwoAR0rHyBqwscgc' },
  { id: 'compton', name: 'Compton', placeId: 'ChIJUfio1oDLwoARXCzclfl4xp8' },
];

const MIN_RATING = 4;

async function fetchReviews(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&reviews_sort=newest&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    console.error(`Error para ${placeId}:`, data.status, data.error_message || '');
    return { reviews: [], rating: null, total: null };
  }
  return {
    reviews: data.result.reviews || [],
    rating: data.result.rating,
    total: data.result.user_ratings_total,
  };
}

async function main() {
  const allGoodReviews = [];

  for (const office of OFFICES) {
    const { reviews, rating, total } = await fetchReviews(office.placeId);
    console.log(`${office.name}: ${reviews.length} reseñas traídas, rating global ${rating} (${total} en total)`);

    const good = reviews
      .filter((r) => r.rating >= MIN_RATING)
      .map((r) => ({
        office: office.name,
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
        language: r.original_language,
      }));

    console.log(`  → ${good.length} de ${reviews.length} son de ${MIN_RATING}+ estrellas`);
    allGoodReviews.push(...good);
  }

  const outDir = join(rootDir, 'public', 'data');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'google-reviews.json');

  writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        reviews: allGoodReviews,
      },
      null,
      2
    )
  );

  console.log(`\n✅ ${allGoodReviews.length} reseñas positivas guardadas en ${outPath}`);
}

main();
