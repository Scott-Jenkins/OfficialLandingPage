const express = require('express');
const req = require('express/lib/request');
const mongodb = require('mongodb')

const router = express.Router();
const conn= 'mongodb+srv://scott27sj:Scott2712@starter.pbxnf.mongodb.net/Starter?retryWrites=true&w=majority';


// get posts
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection()
    res.send(await posts.find({}).toArray())
})


// add posts
router.post('/', async (req, res) =>{
    const posts = await loadPostsCollection()
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    })

    res.status(201).send()
})


//delete posts

router.delete('/:id', async (req, res) =>{
    const posts = await loadPostsCollection()
    await posts.deleteOne({
        _id: new mongodb.ObjectId( req.params.id)
    })

    res.status(200).send()
})

async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect(conn, {
        useNewUrlParser: true
    })

    return client.db('Users').collection('Users')
}


module.exports = router;