-- User Table --

DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User (
    u_id INTEGER PRIMARY KEY,
    nickname TEXT DEFAULT "",
    email TEXT DEFAULT "",
    password TEXT DEFAULT ""
);

INSERT INTO User
    (nickname, email, password) 
VALUES 
    ("na1", "na1@1", "111111"),
    ("na2", "na2@2", "222222"),
    ("na3", "na3@3", "333333"),
    ("na4", "na4@4", "444444"),
    ("na5", "na5@5", "555555");


-- Post Table --

DROP TABLE IF EXISTS Post;
CREATE TABLE IF NOT EXISTS Post (
    p_id INTEGER PRIMARY KEY,
    author_id INTEGER,
    content TEXT DEFAULT "",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Post
    (author_id, content)
VALUES
    ((SELECT u_id FROM User WHERE User.email='na1@1' AND User.password='111111'), 'test post');

DROP TABLE IF EXISTS Comment;
CREATE TABLE IF NOT EXISTS Comment (
    c_id INTEGER PRIMARY KEY,
    p_id INTEGER NOT NULL,
    comment_by INTEGER NOT NULL,
    content TEXT DEFAULT "",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Comment
    (p_id, comment_by, content)
VALUES
    (14, 1, '貼文14測試留言');

DROP TABLE IF EXISTS Friend;
CREATE TABLE Friend (
    room_id INTEGER PRIMARY KEY,
    u_id_from INTEGER NOT NULL,
    u_id_to INTEGER NOT NULL,
    pin_from INTEGER DEFAULT 0,
    pin_to INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Friend
    (u_id_from, u_id_to)
VALUES
    (1, 3);


CREATE TABLE IF NOT EXISTS Message (
    m_id INTEGER PRIMARY KEY,
    u_id_from INTEGER NOT NULL,
    u_id_to INTEGER NOT NULL,
    content TEXT DEFAULT "",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Blacklist (
    b_id INTEGER PRIMARY KEY,
    u_id_from INTEGER NOT NULL,
    u_id_to INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);