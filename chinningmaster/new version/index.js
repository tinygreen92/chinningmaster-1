const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('server running on 3000 port');
});

const conn = mysql.createConnection({ // RDS server
    host: "chinningmaster-20181010.c3b28v5nay11.ap-northeast-2.rds.amazonaws.com",
    user: "whwlsvy12",
    password: "dusgh4314",
    database: "chinningmaster",
    post: 3306
});

conn.connect((err) => {
    if (err) {
        console.log('Db connection fail ', err.stack);
        throw new Error('connect');
    }

});

let query;

app.post('/user', (req, res) => {    // signin - 사용자 회원가입

    const { user_id, user_pw, birth_date, height, weight, name } = req.body;
    query = `insert into user values('${user_id}','${user_pw}',${birth_date},${height},${weight},'${name}');`;

    conn.query(query, (err, data, fields) => {
        if (err) {
            console.log(err.stack);
            return res.send("Fail to add user");
        }
        if (data.affectedRows) {
            res.send(true) // true
        } else {
            res.send(false); // false
        }
    });
});

// app.get('/user', (req, res) => { // login - 사용자 로그인 

//     const { user_id, user_pw } = req.query;
//     query = `select * from user where user_id='${user_id}' and user_pw='${user_pw}';`


//     conn.query(query, (err, data, fields) => {
//         if (err) {
//             console.log(err.stack);
//             return res.send("No users found.");
//         }

//         if (data.length == 0) {
//             res.send(false); // fase
//         } else {
//             res.send(true); // true
//         }
//     })
// });

app.get('/user/:id', (req, res) => {    // EnterEditPersonalInfo - 개인정보 수정 들어갈 때, 페이지에서 보여지는 기존의 회원정보. info/whwlsvy12 이렇게 url에 변수를 넣어여함

    const { id } = req.params;

    query = `select * from user where user_id='${id}';`
    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("No users data found.");
        }
        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send(data); // [{"user_id":"whwlsvy12","user_pw":"dusgh4314","birth_date":930414,"height":172,"weight":75,"name":"박연호"}]
        }
    })
});

app.put('/user/:id', (req, res) => {      // EditPersonalInfo - 실제 개인정보를 수정하는 기능

    const { id } = req.params;
    const { user_pw, birth_date, height, weight, name } = req.body;
    query = `update user set user_pw='${user_pw}',birth_date=${birth_date},height=${height},weight=${weight},name='${name}' where user_id='${id}';`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("User update fail.");
        }
        if (data.affectedRows) {
            res.send(true); // true
        } else {
            res.send(false); // false
        }
    });
});

app.get('/record', (req, res) => {  // GetAllUserRecord

    query = `select distinct r.count,r.elapsed_time,r.correction_rate,u.name from record r,user u where r.is_shared=1;`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Fail to get all record");
        }
        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send(data); // [{"count":10,"elapsed_time":"10:00","correction_rate":"56%","name":"박연"},
            // {"count":5,"elapsed_time":"09:00","correction_rate":"16%","name":"박연"}]
        }
    });
})

app.get('/record/:id', (req, res) => { // GetPersonalRecord

    const { id } = req.params;
    query = `select * from record where user_id='${id}';`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Fail to get user record");
        }
        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send(data);  // [{"user_id":"whwlsvy12","count":10,"start_time":"19:03","elapsed_time":"05:21","correction_rate":"50%","is_shared":0},
            // {"user_id":"whwlsvy12","count":10,"start_time":"13:13","elapsed_time":"03:12","correction_rate":"67%","is_shared":0}]
        }
    })
})

app.get('/record/category/:keyword', (req, res) => { // GetPersonalRecord/GetCategoryData

    const { keyword } = req.params;
    const { user_id } = req.query;

    query = `select ${keyword} from record  where user_id='${user_id}';`

    conn.query(query, (err, data, fields) => {
        if (err) {
            console.log(err.stack);
            return res.send("Fail to get category data");
        }
        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send(data); // [{"count":10},{"count":10},{"count":21},{"count":10},{"count":5},{"count":21},{"count":21}]
        }
    });
});

// app.get('/GetPersonalRecord/Sharing', function (req, res) {          // 이거 뭐하는 부분...??

//     query =
//         "select * from user where user_id='" + req.query.user_id + "'";
//     connection.query(query, function (err, data, fields) {
//         if (err) {
//             throw err; return;
//         }

//         if (data != 0) {
//             res.send(data);
//         }
//     });
// });

app.get('/article', (req, res) => { // GetAllArticle

    query = `select * from article`;

    conn.query(query, (err, data, fields) => {
        if (err) {
            console.log(err.stack);
            return res.send("Fail to get all article");
        }
        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send(data); // [{"article_id":1,"user_id":"whwlsvy12","title":"아 운동 힘들다...","content":"오늘 운동 진짜 빡씨게 했네요.....","workout_record":"record1","name":"박연호","time":"2018-10-11T02:30:16.000Z"},
            // {"article_id":2,"user_id":"whwlsvy12","title":"운동3일차..","content":"치킨이 먹고 싶습니다...","workout_record":"record2","name":"박연호","time":"2018-10-11T02:30:35.000Z"}}
        }
    });
});

app.get('/article/:id', (req, res) => { // ShowArticle

    let result;

    const { id } = req.params;

    query = `select * from article where article_id=${id};`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Fail to get article");
        }

        if (data.length == 0) {
            res.send(false); // false
        } else {
            result = data;
        }
    });

    query = `select * from reply where article_id=${id}`;

    conn.query(query, (err, data, fields) => {


        if (err) {
            console.log(err.stack);
            return res.send("Fail to get article");
        }

        if (data.length == 0) {
            res.send(false); // false
        } else {
            res.send([result, ...data]);
            // [
            //     [
            //         {
            //             "article_id": 1,
            //             "user_id": "whwlsvy12",
            //             "title": "아 운동 힘들다...",
            //             "content": "오늘 운동 진짜 빡씨게 했네요.....",
            //             "workout_record": "record1",
            //             "name": "박연호",
            //             "time": "2018-10-11T02:30:16.000Z"
            //         }
            //     ],
            //     {
            //         "article_id": 1,
            //         "user_id": "whwlsvy12",
            //         "content": "운동 빡씨죠 ㅠㅠ화이팅...",
            //         "time": "2018-10-11T02:37:10.000Z"
            //     },
            //     {
            //         "article_id": 1,
            //         "user_id": "whwlsvy12",
            //         "content": "화이팅!!!!",
            //         "time": "2018-10-11T02:37:26.000Z"
            //     }
            // ]
        }
    });
});

app.put('/article/:id', (req, res) => { // ShowArticle/Edit

    const { title, content, workout_record } = req.body;
    const { id } = req.params;

    query = `update article set title='${title}',content='${content}',workout_record='${workout_record}' where article_id=${id};`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Article update fail.");
        }
        if (data.affectedRows) {
            res.send(true); // true
        } else {
            res.send(false); // false
        }
    });
});

app.post('/reply', (req, res) => { // Reply

    const { article_id, user_id, content } = req.body;
    query = `insert into reply(article_id,user_id,content) values(${article_id},'${user_id}','${content}');`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Fail to add reply");
        }
        if (data.affectedRows) {
            res.send(true) // true
        } else {
            res.send(false); // false
        }
    });
});

app.post('/article', (req, res) => { // WriteArticle

    const { user_id, title, content, workout_record, name } = req.body;
    query = `insert into article(user_id,title,content,workout_record,name) values('${user_id}','${title}','${content}','${workout_record}','${name}');`

    conn.query(query, (err, data, fields) => {

        if (err) {
            console.log(err.stack);
            return res.send("Fail to add article");
        }
        if (data.affectedRows) {
            res.send(true) // true
        } else {
            res.send(false); // false
        }
    })
})