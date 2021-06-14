let db = require('../database');

newPost = (email, password, content) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Post
            (author_id, content)
                VALUES
            ((SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}'), '${content}');`;
        console.log(sql);
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

getRecentPosts = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT u.nickname, u.u_id, p.content, p.p_id
            FROM Post as p 
            LEFT JOIN User as u ON p.author_id = u.u_id
            ORDER BY created_at DESC;`;
        db.all(sql, function (err, rows) {
            if (err) throw (err);
            resolve(rows);
        });
    });
}

getPostComment = (post_id) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT c.content, u.nickname, u.u_id
            FROM Comment as c
            LEFT JOIN User as u ON c.comment_by = u.u_id
            WHERE c.p_id = ${post_id}
            ORDER BY created_at DESC`;
        db.all(sql, function (err, rows) {
            if (err) throw (err);
            resolve(rows);
        });
    })
}

newComment = (post_id, email, password, content) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Comment
            (p_id, comment_by, content)
                VALUES
            (${post_id}, (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}'), '${content}');`;
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

deletePost = (p_id) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM Post WHERE p_id = ${p_id};`;
        console.log(sql);
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

module.exports = {
    newPost,
    getRecentPosts,
    newComment,
    getPostComment,
    deletePost
}