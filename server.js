import express from 'express';
import querystring from 'querystring';

import fetch from 'node-fetch';



var client_id = '6547d30e76844a7783c0841aa0ce1b09';
var redirect_uri = 'http://127.0.0.1:3000/callback';
var client_secret= '76d7a24e7ff14615a6049383b470172d'

var app = express();

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}



app.get('/callback', async function(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      })
    });

    const data = await response.json();

    if (data.access_token) {
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token);
      res.send('Authorization successful! You can close this window.');
    } else {
      console.error('Token exchange error:', data);
      res.send(' Token exchange failed. See terminal.');
    }

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send('Server error during token exchange');
  }
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});