import fetch from 'node-fetch';
import fs from 'fs';

var client_id = '6547d30e76844a7783c0841aa0ce1b09';
var client_secret= '76d7a24e7ff14615a6049383b470172d'
const tokenData = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
const refresh_token= tokenData.refresh_token;

async function refreshAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });

  const data = await response.json();

  if (data.access_token) {
    console.log('✅ New Access Token:', data.access_token);

    // Optional: save it to tokens.json
    const fs = await import('fs');
    fs.writeFileSync('tokens.json', JSON.stringify({ access_token: data.access_token }, null, 2));
    console.log('✅ Saved to tokens.json');
  } else {
    console.error('❌ Failed to refresh token:', data);
  }
}

refreshAccessToken();
