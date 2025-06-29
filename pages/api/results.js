import fetch from 'node-fetch';
import fs from 'fs';

const tokenData = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
const accessToken = tokenData.access_token;

const query = encodeURIComponent(`"Lady Gaga"`);
const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`;

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${accessToken}` }
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));