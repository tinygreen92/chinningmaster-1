var express = require ('express');
var app = express ();
var mysql = require ('mysql');
var bodyParser = require ('body-parser');



app.use (bodyParser.json ());
app.use (bodyParser.urlencoded (
				 {
extended:			 true}

	 ));

app.use (express.json ());	
app.use (express.urlencoded ());

var query;


app.listen (3000);

var connection = mysql.createConnection ({
host:					 "chinningmaster-20181010.c3b28v5nay11.ap-northeast-2.rds.amazonaws.com",
user:					 "whwlsvy12",
database:				 "chinningmaster",
password:				 "dusgh4314",
port:					 3306
					 }

);

connection.connect (function (err)
		    {
		    if (err)
		    {
		    console.error ('Database connection failed: ' +
				   err.stack); return;}
		    console.log ('Connected to database.');}

);


app.post ('/signin', function (req, res)
	  {


	  query =
	  "insert into user values('" + req.body.user_id + "','" +
	  req.body.user_pw + "','" + req.body.birth_date + "','" +
	  req.body.height + "','" + req.body.weight + "','" + req.body.name +
	  "');";
	  connection.query (query, function (err, data, fields)
			    {
			    if (err)
			    {
			    console.log (err.stack); return;}

			    if (data.affectedRows)
			    {
			    res.send (true);}
			    else
			    {
			    res.send (false);}

			    }
	  );}

);

app.get ('/login', function (req, res)
	 {

	 query =
	 "select * from user where user_id='" + req.query.user_id +
	 "' and user_pw='" + req.query.user_pw + "'";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   console.log (err.stack); return;}

			   if (data != 0)
			   {
			   res.send (200,[{"result":true}]); return;}

			   res.send (404,[{"result":false}]); return;}
	 );}

);


app.get ('/EnterEditPersonalInfo', function (req, res)
	 {

	 query =
	 "select * from user where user_id='" + req.query.user_id + "'";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   console.log (err.stack); return;}

			   res.send (data);}
	 );}

);


app.post ('/EditPersonalInfo', function (req, res)
	  {

	  query =
	  "update user set user_pw='" + req.body.user_pw + "' ,birth_date=" +
	  req.body.birth_date + ",height=" + req.body.height + ",weight=" +
	  req.body.weight + ",name='" + req.body.name + "' where user_id='" +
	  req.body.user_id + "'";
	  connection.query (query, function (err, data, fields)
			    {
			    if (err)
			    {
			    throw err; return;}

			    if (data.affectedRows)
			    {
			    res.send (true);}
			    else
			    {
			    res.send (false);}
			    }
	  );}

);

app.get ('/GetAllUserRecord', function (req, res)
	 {

	 query ="select * from record";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   res.send (data); return}
			   }
	 );}

);

app.get ('/GetPersonalRecord', function (req, res)
	 {

	 query =
	 "select * from record where user_id='" + req.query.user_id + "'";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   res.send (data);}
			   }
	 );}

);

app.get ('/GetPersonalRecord/GetCategoryData', function (req, res)
	 {

	 query =
	 "select " + req.query.category + " from record where user_id='" +
	 req.query.user_id + "'";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   res.send (data);}

			   }
	 );}

);


app.get ('/GetPersonalRecord/Sharing', function (req, res)
	 {

	 query =
	 "select * from user where user_id='" + req.query.user_id + "'";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   res.send (data);}
			   }
	 );}

);

app.get ('/GetAllArticle', function (req, res)
	 {

	 query = "select * from article";
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   res.send (data);}
			   else
			   {
			   res.send (false);}
			   }
	 );}

);

app.get ('/ShowArticle', function (req, res)
	 {

	 var result =[];
	 query =
	 "select * from article where article_id=" + req.query.article_id;
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   throw err; return;}

			   if (data != 0)
			   {
			   result.push (data);}

			   }
	 );
	 query =
	 "select * from reply where article_id=" + req.query.article_id;
	 connection.query (query, function (err, data, fields)
			   {
			   if (err)
			   {
			   console.log (err.stack); return;}


			   if (data != 0)
			   {
			   result.push (data);}

			   res.send (result);}
	 );}

);


app.post ('/ShowArticle/Edit', function (req, res)
	  {


	  query =
	  "update article set title='" + req.body.title + "' ,content='" +
	  req.body.content + "',workout_record='" + req.body.workout_record +
	  "' where user_id='" + req.body.user_id + "'";
	  connection.query (query, function (err, data, fields)
			    {


			    if (err)
			    {
			    throw error; res.send (false); return;}

			    if (data.affectedRows)
			    {
			    res.send (true);}
			    else
			    {
			    res.send (false);}

			    }
	  );}

);


app.post ('/Reply', function (req, res)
	  {

	  query =
	  "insert into reply(article_id,user_id,content) values('" +
	  req.body.article_id + "','" + req.body.user_id + "','" +
	  req.body.content + "')";
	  connection.query (query, function (err, data, fields)
			    {
			    if (err)
			    {
			    throw err; res.send (false); return;}

			    if (data.affectedRows)
			    {
			    res.send (true);}
			    else
			    {
			    res.send (false);}
			    }
	  );}

);


app.post ('/WriteArticle', function (req, res)
	  {


	  query =
	  "insert into article(user_id,title,content,workout_record,name) values('"
	  + req.body.user_id + "','" + req.body.title + "','" +
	  req.body.content + "','" + req.body.workout_record + "','" +
	  req.body.name + "')";
	  connection.query (query, function (err, data, fields)
			    {

			    if (err)
			    {
			    throw err; res.send (false); return;}

			    if (data.affectedRows)
			    {
			    res.send (true);}
			    else
			    {
			    res.send (false);}
			    }
	  );}

);
