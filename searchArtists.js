import fetch from 'node-fetch';
import fs from 'fs';

const tokenData = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
const accessToken = tokenData.access_token;

// Define the labels and their artist files
const labels = {
  Atlantic: 'data/raw_json/atlantic.json',
  Columbia: 'data/raw_json/columbia.json',
  Republic: 'data/raw_json/republic.json',
};

const labelGenreMap = {}; 

(async () => {
  for (const [label, filePath] of Object.entries(labels)) {
    console.log(`Processing label: ${label}`);
    const artistData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const genreCounts = await getGenreCounts(artistData);
    labelGenreMap[label] = genreCounts;
  }

  // Save genre summary
  const outputPath = 'data/processed/genre_summary_by_label.json';
  fs.writeFileSync(outputPath, JSON.stringify(labelGenreMap, null, 2));
  console.log(`Genre summary saved to ${outputPath}`);
})();

// Count genres for one label
async function getGenreCounts(artists) {
  const genreCount = {};

  for (const artist of artists) {
    const name = artist.artistName.trim();
    const query = encodeURIComponent(name);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (data.artists && data.artists.items.length > 0) {
        const spotifyArtist = data.artists.items[0];
        const genres = spotifyArtist.genres || [];

        for (const genre of genres) {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }

        console.log(`✔ ${name}: ${genres.join(', ')}`);
      } else {
        console.warn(`No match for: ${name}`);
      }

    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error.message);
    }
  }

  return genreCount;
}
