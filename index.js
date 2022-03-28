const express = require('express'); 
const path = require('path')
const app = express();              
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000;
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var request = require('request');
const jwt = require("jsonwebtoken");

// set up for static files

app.use("/", express.static(__dirname));

//middleware

app.use(bodyParser.json());
app.use(cors());

console.clear();

//api
const posts = require('./routes/posts.js')
app.use('/api/posts', posts)
console.log("UP -- API")

//reddit

const reddit = require('./reddit/reddit.js')
app.use('/reddit', reddit)
console.log("UP -- REDDIT")

/*
const spotify = require('./spotify/spotify.js')
app.use('/spotify', spotify)
console.log("UP -- SPOTIFY")
*/

const spotify = require('./spotify/spotify.js')
    app.use('/spotify', spotify)
    console.log("UP -- SPOTIFY")

    var spotify_access_token = ''
    var client_id = '579419be803d4ccaa786734dae89c2d7'; // Your client id
    var client_secret = '4824aa0c25554de5abaae63d87421b8e'; // Your secret
    //var redirect_uri = 'http://localhost:5000/spotify/callback'; // Your redirect uri
    var redirect_uri = port + '/spotify/callback'
    
 /**
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
 var generateRandomString = function(length) {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };
 
 var stateKey = 'spotify_auth_state';

 
 app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());
 
 app.get('/login', function(req, res) {
     try {
         // your application requests authorization
        var scope = 
            'ugc-image-upload '+
            'user-read-playback-state '+
            'user-modify-playback-state '+
            'user-read-currently-playing '+
            'streaming '+
            'app-remote-control '+
            'user-read-email '+
            'user-read-private '+
            'playlist-read-collaborative '+
            'playlist-modify-public '+
            'playlist-read-private '+
            'playlist-modify-private '+
            'user-library-modify '+
            'user-library-read '+
            'user-top-read '+
            'user-read-playback-position '+
            'user-read-recently-played '+
            'user-follow-read '+
            'user-follow-modify';

        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
         
     } catch (error) {
         console.log(error)
     }
 
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   
 });
 
 app.get('/spotify/callback', function(req, res) {
     console.log('on the page')
 
   // your application requests refresh and access tokens
   // after checking the state parameter
 
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;
 //state === null || state !== storedState
   if (code == null) {
     res.redirect('/?' +
       querystring.stringify({
         error: 'state_mismatch'
       }));
   } else {
     res.clearCookie(stateKey);
     var authOptions = {
       url: 'https://accounts.spotify.com/api/token',
       form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: 'authorization_code'
       },
       headers: {
         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
       },
       json: true
     };
 
     request.post(authOptions, function(error, response, body) {
       if (!error && response.statusCode === 200) {
 
         var access_token = body.access_token,
             refresh_token = body.refresh_token;
 
         
         
         setSpotifyToken(access_token)
            res.cookie(`spotify_access_token`,access_token,{
                maxAge: 24 * 60 * 60 * 1000 * 90 , //3 months
                secure: true,
                httpOnly: true,
            });
         // we can also pass the token to the browser to make requests from there
         res.redirect('/?' +
           querystring.stringify({
             access_token: access_token,
             refresh_token: refresh_token
           }));
                
       } else {
         res.redirect('/#' +
           querystring.stringify({
             error: 'invalid_token'
           }));
       }
     });
   }
 });
 
 app.get('/refresh_token', function(req, res) {
 
   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
     form: {
       grant_type: 'refresh_token',
       refresh_token: refresh_token
     },
     json: true
   };
 
   request.post(authOptions, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.send({
         'access_token': access_token
       });
     }
   });
 });
    


function setSpotifyToken(token){
    spotify_access_token = token
}

//access_token = 'BQBqL5VT2II2X54gBBbmlf08rTclN6B0N30c3rOgqMEncQ4G07TTRdhg2JXk0kOdPzuN1ddUC1iNYdA5y9oipE0o-PIiwFTNeCN38qx4UHAQRnkmcVW1sNybz4BEoHZT-qNJI4primtPmMNHf18gV-bht6Kd_nBdznx2jJGb7puQIGarKEZ0GRIoUhdee8CsY2CjU22x_pS4NpPHhmokrSmI8bAZ-t4WHPdSt6WRbtSld_KDyeoaTpzJo0XK_yonhglqr_2BipMQlbk1Uql-HOYbWtwDOH7ZHcBavXImSHmdtgBVdirO'
app.get('/me', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
          var access_details = {'spotify_access_token': spotify_access_token}
          //body.push(access_details)
        //res.json(body);
        res.send({
            'spotify_access_token': spotify_access_token,
            body
        })
      });
});


app.get('/playlists', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me/playlists?limit=50',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.json(body);
      });
});

app.get('/recentlyPlayed', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {

        if(error){
            console.log(error)
            return
        }
        res.json(body);
      });
});

app.get('/topArtist', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me/top/artists?offset=0&limit=20',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.json(body);
      });
});

app.get('/playlist/:id', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/playlists/' + req.params.id + '/tracks',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.json(body);
      });
});

app.get('/play/:song', function (req, res) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotify_access_token
    };
    
    //var dataString = '{"device_ids":['+ req.params.device +'], "play": true}';
    ///var dataString = '{"device_ids": ['+ req.params.device +']}';
    var dataString = `{"context_uri": "${req.params.song}","offset": {"position": 5},"position_ms": 0}`;
      console.log(dataString)
    var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        method: 'PUT',
        headers: headers,
        body: dataString
    };    
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
    
    request(options, callback);
    res.json("ok");
});

app.get('/pause/:device', function (req, res) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotify_access_token
    };
    
    var dataString = '{"device_ids":['+ req.params.device +']}';
    
    var options = {
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: 'PUT',
        headers: headers,
        body: dataString
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
    
    request(options, callback);
    res.json("ok");
});

app.get('/devices', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.json(body);
      });
});

app.get('/playback', function (req, res) {
    var options = {
        url: 'https://api.spotify.com/v1/me/player',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.json(body);
      });
});


app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});
