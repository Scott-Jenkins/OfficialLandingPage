const express = require('express');
const app = express();
const req = require('express/lib/request');
const mongodb = require('mongodb');
const router = express.Router();
const axios = require("axios");
const fetch = require("node-fetch");

module.exports = router;
'use strict';
const snoowrap = require('snoowrap');

const r = new snoowrap({
    userAgent: 'Landing Page Widget by u/Scott2712',
    clientId: 'OsSLTmWkWIKHXG06nApv2g',
    clientSecret: 'DRew6Zvuv2zyA3SVQv1U7Pw39sIGTw',
    refreshToken: '50583201239-cFGb5VAFrwLr7yvXr94i64Nl9ep6OA',
});

var returnCode = 'TQ2f9Ynm0WK9jNC-2ta3V2VUqdl8Ww#'
fetchToken(returnCode)
async function fetchToken(returnCode) {
    const form = new URLSearchParams({
        grant_type: "authorization_code",
        code: returnCode,
        redirect_uri: "http://localhost:5000/"
    })

    const credentials = Buffer.from(`${'OsSLTmWkWIKHXG06nApv2g'}:${'DRew6Zvuv2zyA3SVQv1U7Pw39sIGTw'}`).toString("base64")

    const res = await fetch('https://www.reddit.com/api/v1/access_token', { 
    method: "POST",
    headers: {
        Authorization: `Basic ${credentials}`
    },
    body: form
    })
    if (!res.ok) throw new Error(`${res.status}: ${await  res.text()}`)
    console.log(await res.json())
}
// refresh 50583201239-cFGb5VAFrwLr7yvXr94i64Nl9ep6OA

//access 50583201239-1woSZy2YcuKe57Fs930AS6OJB9dStg

//https://www.reddit.com/api/v1/authorize?client_id=OsSLTmWkWIKHXG06nApv2g&response_type=code&state=RANDOM_STRING&redirect_uri=http://localhost:5000/&duration=permanent&scope=account adsconversions creddits edit flair history identity livemanage modconfig modcontributors modflair modlog modmail modothers modposts modself modtraffic modwiki mysubreddits privatemessages read report save structuredstyles submit subscribe vote wikiedit wikiread                                                   











// feeds
var hot = r.getHot().map(post => post)
router.get('/hot', function (req, res) {
    res.json(hot); //also tried to do it through .send, but there data only on window in browser
});

var best = r.getBest().map(post => post)
router.get('/best', function (req, res) {
    res.json(best); //also tried to do it through .send, but there data only on window in browser
});

var newPost = r.getNew().map(post => post)
router.get('/new', function (req, res) {
    res.json(newPost); //also tried to do it through .send, but there data only on window in browser
});

var top = r.getTop().map(post => post)
router.get('/top', function (req, res) {
    res.json(top); //also tried to do it through .send, but there data only on window in browser
});

var Cont = r.getTop().map(post => post)
router.get('/controversial', function (req, res) {
    res.json(Cont); //also tried to do it through .send, but there data only on window in browser
});

var rising = r.getTop().map(post => post)
router.get('/rising', function (req, res) {
    res.json(rising); //also tried to do it through .send, but there data only on window in browser
});



//upvote downvote

router.get('/upvote/:id', async (req, res) => {
    r.getSubmission(req.params.id).upvote()
    console.log("deleted")
})


//User info
// var user = r.getMe()
// router.get('/user', function (req, res) {
//     res.json(user); //also tried to do it through .send, but there data only on window in browser
// });









