# DBMS Final Project

## 系統架構與環境
- Programming language：node.js (express)
- Database：SQLite3
- Environment：Ubuntu 20.04

---

## 介面截圖

![](https://i.imgur.com/YeMYlCZ.png)

![](https://i.imgur.com/luzpF8r.png)

---

## 使用說明
### Install

```
npm install
```

### Start

```
npm start
```

---

## 資料庫設計

### ER Diagram

![](https://i.imgur.com/ujwk6O2.png)

### Relation Schema

![](https://i.imgur.com/15bg45n.png)

### Table、attribute、relationship 說明
- User table：紀錄社群軟體中的每一位用戶
    - u_id：Primary key，作為 foreign key 關聯到其他所有 table
    - nickname：用戶的暱稱
    - email、password：用戶的登入資訊
- Hobby table：紀錄用戶的興趣(文字)
    *因一位用戶可有多個興趣，故 Hobby 需獨立為一個 table 才足以紀錄*
    - h_id：Primary key
    - owner_id：所屬的 User 之 u_id
    - content：興趣的內容(文字)
- Post table：記錄所有用戶的貼文
    - p_id：Primary key，作為 foreign key 關聯到 Comment table
    - author_id：發文者的 u_id
    - content：貼文的內容
    - created_at：貼文發布的時間
- Comment table：記錄所有貼文的留言
    - c_id：Primary key
    - p_id：留言所屬的貼文之 p_id
    - commented_by：留言人自己的 u_id
    - content：留言內容
    - created_at：留言時間
- Friend table：紀錄所有好友(pair)
    - f_id：Primary key
    - u_id_from、u_id_to：成為好友的 User 雙方的 u_id
    - pin_from、pin_to：好友雙方是否在聊天室中釘選對方
    - created_at：雙方成為好友的時間
- Blacklist table：紀錄將對方加入黑名單的用戶雙方
    - b_id：Primary key
    - u_id_from：將對方加入黑名單的 User 的 u_id
    - u_id_to：被加入黑名單的 User 的 u_id
    - time：將對方加入黑名單的時間
- Message table：
    - m_id：Primary key
    - u_id_from、u_id_to：傳遞訊息的好友雙方的 u_id
    - content：訊息內容
    - time：訊息傳遞時間

### Embedded SQL 說明
#### 1. SELECT-FROM-WHERE
- User：
    - 查詢用戶檔案
    ```
    SELECT * FROM User WHERE email = 'na1@1' AND password = '111111';
    ```
- Friend：
    - 查詢與好友的聊天訊息
    ```
    SELECT m.content, m.u_id_from, u.nickname
            FROM Message as m
            LEFT JOIN User as u ON m.u_id_from = u.u_id
            WHERE (u_id_from = 1 AND u_id_to = 3) OR (u_id_from = 3 AND u_id_to = 1)
            ORDER BY created_at;
    ```
- Post：
    - 顯示所有貼文
    ```
    SELECT u.nickname, u.u_id, p.content, p.p_id
            FROM Post as p 
            LEFT JOIN User as u ON p.author_id = u.u_id
            ORDER BY created_at DESC;
    ```

----

#### 2. DELETE
- Post：
    - 刪除貼文
    ```
    DELETE FROM Post WHERE p_id = 3;
    ```


----

#### 3. INSERT
- User：
    - 建立新用戶
    ```
    INSERT INTO User (email, password, nickname) VALUES ('testuser', 'testuser', 'testuser');
    ```
- Post
    - 建立留言
    ```
    INSERT INTO Comment
                (p_id, comment_by, content)
                    VALUES
                (16, (SELECT u_id FROM User WHERE User.email='na1@1' AND User.password='111111'), '剛剛新增的留言');
    ```
- Friend
    - 新增聊天訊息
    ```
    INSERT INTO Message (u_id_from, u_id_to, content) 
            VALUES (
                1, 3, '剛剛新增的訊息'
            );
    ```
    - 新增好友至黑名單
    ```
    INSERT INTO Blacklist (u_id_from, u_id_to) VALUES (1, 8);
    ```

----

#### 4. UPDATE
- User
    - 更新用戶檔案
    ```
    UPDATE User SET nickname='剛剛改了暱稱' WHERE u_id = 1;
    ```

----

#### 5. EXISTS、NOT EXISTS
- 在黑名單的用戶，不會被顯示至好友名單
```
SELECT u2.nickname, u2.u_id FROM Friend as f 
LEFT JOIN User as u1 ON f.u_id_from = u1.u_id
LEFT JOIN User as u2 ON f.u_id_to = u2.u_id
WHERE u1.email = 'na1@1' 
    AND u1.password = '111111' 
    AND NOT EXISTS (
        SELECT 1 
        FROM Blacklist 
        WHERE u_id_from = u1.u_id AND u_id_to = u2.u_id
    );
```

----

#### 6. Aggregate functions 
- 顯示 User 總貼文數量：`COUNT`、`SUM`
- 計算 User 貼文平均留言數：`AVG`
- 顯示 User 貼文最大留言數量：`MAX`
- 顯示 User 貼文最小留言數量：`MIN`
- 上述統計的貼文、留言內容皆不為空：`HAVING`

```
SELECT avg(count) as cmt_cnt
FROM (
    SELECT COUNT(*) as count FROM Comment as c
    WHERE (SELECT p.author_id FROM Post as p WHERE p.p_id = c.p_id) = (SELECT u_id FROM User WHERE User.email='${email}' AND User.password='${password}')
    GROUP BY p_id
    HAVING c.content <> ''
);
```
