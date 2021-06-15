# DBMS Final Project

## 系統架構與環境
- Programming language：node.js (express)
- Database：SQLite3
- Environment：Ubuntu 20.04
- Project Hierarchy
.
├── ainimal.drawio
├── app.js
├── bin
│   └── www
├── database
│   ├── db.sqlite
│   ├── index.js
│   └── init.sql
├── db.sqlite
├── models
│   ├── friend_model.js
│   ├── post_model.js
│   └── user_model.js
├── package-lock.json
├── package.json
├── public
│   ├── javascripts
│   └── stylesheets
├── routes
│   ├── friend.js
│   ├── index.js
│   ├── post.js
│   └── user.js
└── views
    ├── error.pug
    ├── friend.pug
    ├── index.pug
    ├── layout.pug
    ├── post.pug
    ├── signup.pug
    └── user.pug

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
DEBUG=dbms-final:* npm start
```

---

## 資料庫設計

### ER Diagram

![](https://i.imgur.com/ujwk6O2.png)

### Relation Schema

![](https://i.imgur.com/15bg45n.png)

### Table、attribute、relationship 意義說明
- User table：紀錄社群軟體中的每一位用戶
    - u_id：Primary key，作為 foreign key 關聯到其他所有 table
    - nickname：用戶的暱稱
    - email、password：用戶的登入資訊
- Hobby table：紀錄用戶的興趣(文字)
    :::info
    因一位用戶可有多個興趣，故 Hobby 需獨立為一個 table 才足以紀錄
    :::
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
