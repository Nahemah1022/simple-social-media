var express = require('express');
var router = express.Router();
var PostModel = require('../models/post_model.js');

/* GET posts listing. */
router.get('/', async function (req, res, next) {
    let posts = await PostModel.getRecentPosts();
    data = {
        pagetitle: 'Posts',
        post: []
    };
    for (let index = 0; index < posts.length; ++index) {
        let post = posts[index];
        let post_data = {
            post_id: post.p_id,
            author: {
                nickname: post.nickname,
                u_id: post.u_id
            },
            content: post.content
        }

        post_data.comment = [];
        let comments = await PostModel.getPostComment(post.p_id);
        if (comments.length) {
            comments.forEach(comment => {
                post_data.comment.push({
                    author: {
                        nickname: comment.nickname,
                        u_id: comment.u_id
                    },
                    content: comment.content
                });
            });
        }
        data.post.push(post_data);
    }
    res.render('post', data);
});

router.post('/new', async function (req, res, next) {
    await PostModel.newPost(req.body.account, req.body.password, req.body.content);
    res.redirect('/post');
})

router.post('/comment', async function (req, res, next) {
    for (let key in req.body) {
        if (key.includes('_') && key.split('_')[0] === 'post' && req.body[key] !== '') {
            let post_id = key.split('_').pop();
            console.log(post_id);
            await PostModel.newComment(post_id, req.body.account, req.body.password, req.body[key]);
        }
    }
    res.redirect('/post');
})

router.post('/delete', async function (req, res, next) {
    for (let key in req.body) {
        await PostModel.deletePost(key);
    }
    res.redirect('/post');
})

module.exports = router;