let db = require('../database');

query = (query) => {
    return new Promise((resolve, reject) => {
        db.all(query, function (err, rows) {
            if (err) throw (err);
            console.log(rows);
            resolve(rows);
        });
    });
}

createUser = (email, password, nickname) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO User (email, password, nickname) VALUES ('${email}', '${password}', '${nickname}');`;
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve({ email, password, nickname });
        });
    });
}

getProfile = (email, password) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM User WHERE User.email='${email}' AND User.password='${password}';`;
        db.all(sql, function (err, rows1) {
            if (err) throw (err);
            let result = rows1[0];

            let sql = `SELECT count(*) as post_cnt FROM Post WHERE author_id = (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}');`;
            db.all(sql, function (err, rows2) {
                if (err) throw (err);
                Object.assign(result, rows2[0])
                let sql = `SELECT avg(count) as cmt_cnt
                    FROM (
                        SELECT COUNT(*) as count FROM Comment as c
                        WHERE (SELECT p.author_id FROM Post as p WHERE p.p_id = c.p_id) = (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}')
                        GROUP BY p_id
                        HAVING c.content <> ''
                    );`;
                db.all(sql, function (err, rows3) {
                    if (err) throw (err);
                    Object.assign(result, rows3[0])
                    let sql = `SELECT MAX(count) as max_cmt, MIN(count) as min_cmt
                        FROM (
                            SELECT COUNT(*) as count FROM Comment as c
                            WHERE (SELECT p.author_id FROM Post as p WHERE p.p_id = c.p_id) = (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}')
                            GROUP BY p_id
                            HAVING c.content <> ''
                        );`;
                    db.all(sql, function (err, rows4) {
                        if (err) throw (err);
                        Object.assign(result, rows4[0])
                        resolve(result);
                    });
                });
            });
        });
    });
}

updateUser = (me, nickname) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE User SET nickname='${nickname}' WHERE u_id = ${me};`;
        console.log(sql);
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    })
}

module.exports = {
    createUser,
    getProfile,
    query,
    updateUser
}