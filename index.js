const express = require("express");
const crypto = require('crypto');
const fs = require("fs/promises");
const mysql = require("mysql");
require("ejs");

const conn = mysql.createConnection({
  host: "bl1xsmdwixfj51trsge3-mysql.services.clever-cloud.com",
  user: "uyncuybc3wx0sg3a",
  password: "bTysf7SKjczXKWsX1v2a",
  database: "bl1xsmdwixfj51trsge3"
})

conn.connect()

const app = express();
app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.listen(80, () => {
  console.log("Running!")
})

app.get("/", (req,res) => {
  return res.send({
    defaultroute: "/api/*",
    message: "Welcome to Harlex API home route"
  });
});

app.get("/list", (req,res) => {
  conn.query("SELECT * FROM comment", (error, results, fields) => {
    if(error) throw error;

    let message;
    if(results === undefined || results.length == 0) {
      message = "No comments";
    }else{
      message = "Successfully fetched all comments";
    }
    return res.render("list", {
      data: results,
      message: message
    })
  })
});

app.post("/api/comment/delete/:id", (req, res) => {
  let commentID = req.params.id;

  if(!commentID) {
    return res.sendStatus(500)
  }else{
    conn.query("DELETE FROM comment WHERE uuid = ?", [commentID], (error, results, fields) => {
      if(error) throw error;

      let message;
      if(results.affectedRows === 0) {
        message = "Not found";
      }else{
        message = "Deleted!";
      }

      res.redirect("/list");
    })
  }
});

app.post("/api/comment", (req, res) => {
  let id = crypto.randomUUID();
  let content = req.body.content;
  let author = req.body.author;
  console.log(req.body)

  if(!content || !author) {
    return res.redirect("/list?fieldsRequired")
  }else{
    conn.query("INSERT INTO comment (uuid, content, author) VALUES(?, ?, ?)", [id, content, author], (error, results, fields) => {
      if(error) throw error;
      res.redirect("/list");
    })
  }
})

app.get("/api/comment/:id", (req, res) => {
  const commentID = req.params.id;
  if(!commentID) {
    res.sendStatus(500)
  }else{
    conn.query("SELECT * FROM comment WHERE uuid = ?", commentID, (error, results, fields) => {
      if(error) throw error;
      let message;
      if(results === undefined || results.length == 0) {
        message = "Not found";
      }else{
        message = "Successfully fetch from api";
      }

      return res.send({
        data: results[0],
        message: message
      })
    })
  }
})

app.get("/api/comment/:id/content", (req, res) => {
  const commentID = req.params.id;
  if(!commentID) {
    res.sendStatus(500)
  }else{
    conn.query("SELECT * FROM comment WHERE uuid = ?", commentID, (error, results, fields) => {
      if(error) throw error;
      let message;
      if(results === undefined || results.length == 0) {
        message = "Not found";
      }else{
        message = "Successfully fetch from api";
      }

      return res.send({
        data: results[0].content,
        message: message
      })
    })
  }
})

app.get("/api/comment/:id/author", (req, res) => {
  const commentID = req.params.id;
  if(!commentID) {
    res.sendStatus(500)
  }else{
    conn.query("SELECT * FROM comment WHERE uuid = ?", commentID, (error, results, fields) => {
      if(error) throw error;
      let message;
      if(results === undefined || results.length == 0) {
        message = "Not found";
      }else{
        message = "Successfully fetch from api";
      }

      return res.send({
        data: results[0].author,
        message: message
      })
    })
  }
})

app.get("/api/comment/:id/posted_at", (req, res) => {
  const commentID = req.params.id;
  if(!commentID) {
    res.sendStatus(500)
  }else{
    conn.query("SELECT * FROM comment WHERE uuid = ?", commentID, (error, results, fields) => {
      if(error) throw error;
      let message;
      if(results === undefined || results.length == 0) {
        message = "Not found";
      }else{
        message = "Successfully fetch from api";
      }

      return res.send({
        data: results[0].posted_at,
        message: message
      })
    })
  }
})