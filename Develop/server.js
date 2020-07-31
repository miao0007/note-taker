// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// set up app to handle data parsing
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static("public"));

// Routes

// route to send user to index page
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// route to send user to note page
app.get("/notes", function(req,res){
    res.sendFile(path.json(__dirname, "./public/notes.html"));
});

// route that send user the db.json file
app.get("/api/notes", function(req,res){
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// JSON input with keys title and text and add new note object with the message into the db.json file

app.post("/api/notes", function(req,res){
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8",function(err,response){
        if(err){
            console.log(err);
        }
       const notes = JSON.parse(response);
       const noteRequest = req.body;
       const newId = notes.length+1;
       const newNote = {
           id: newId,
           title: noteRequest.title,
           text: noteRequest.text
       } ;
       notes.push(newNote);
       res.json(newNote);
       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err){
           if (err) throw err;
       });

    });
});







// Starts the server to begin listening
app.listen(PORT, function(){
console.log("App listening on PORT: " + PORT);
});
