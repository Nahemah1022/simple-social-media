let db = require('../database');

getFriends = (email, password) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT u2.nickname, u2.u_id FROM Friend as f 
            LEFT JOIN User as u1 ON f.u_id_from = u1.u_id
            LEFT JOIN User as u2 ON f.u_id_to = u2.u_id
            WHERE u1.email = '${email}' 
                AND u1.password = '${password}' 
                AND NOT EXISTS (
                    SELECT 1 
                    FROM Blacklist 
                    WHERE u_id_from = u1.u_id AND u_id_to = u2.u_id
                )`;
        db.all(sql, function (err, rows1) {
            if (err) throw (err);
            let sql = `
                SELECT u1.nickname, u1.u_id FROM Friend as f 
                LEFT JOIN User as u1 ON f.u_id_from = u1.u_id
                LEFT JOIN User as u2 ON f.u_id_to = u2.u_id
                WHERE u2.email = '${email}' 
                    AND u2.password = '${password}'
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM Blacklist 
                        WHERE u_id_from = u2.u_id AND u_id_to = u1.u_id
                    );`
            db.all(sql, function (err, rows2) {
                if (err) throw (err);
                resolve([...rows1, ...rows2]);
            });
        });
    });
}

addFriend = (email, password, target) => {
    return new Promise(async (resolve, reject) => {
        let friends = await getFriends(email, password);
        friends.forEach(f => {
            if (f.u_id === parseInt(target)) {
                resolve("existed");
            }
        });

        let sql = `INSERT INTO Friend (u_id_from, u_id_to) 
            VALUES (
                (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}'), '${target}'
            );`;
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

newMessage = (from, to, content) => {
    return new Promise(async (resolve, reject) => {
        let sql = `INSERT INTO Message (u_id_from, u_id_to, content) 
            VALUES (
                ${from}, ${to}, '${content}'
            );`;
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

getRecentMessages = (from, to) => {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT m.content, m.u_id_from, u.nickname
            FROM Message as m
            LEFT JOIN User as u ON m.u_id_from = u.u_id
            WHERE (u_id_from = ${from} AND u_id_to = ${to}) OR (u_id_from = ${to} AND u_id_to = ${from})
            ORDER BY created_at`;
        db.all(sql, function (err, rows) {
            if (err) throw (err);
            resolve(rows);
        });
    });
}

addBlacklist = (from, to) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Blacklist (u_id_from, u_id_to) VALUES (${from}, ${to});`;
        db.run(sql, function (res, err) {
            if (err) throw (err);
            resolve();
        });
    });
}

module.exports = {
    getFriends,
    addFriend,
    newMessage,
    getRecentMessages,
    addBlacklist
}