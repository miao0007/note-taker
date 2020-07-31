// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// set up app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes

// route to send user to index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// route to send user to note page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// route that send user the db.json file
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

// JSON input with keys title and text and add new note object with the message into the db.json file

app.post("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", function (
    err,
    response
  ) {
    if (err) {
      console.log(err);
    }
    const notes = JSON.parse(response);
    const noteRequest = req.body;
    const newId = notes.length + 1;
    const newNote = {
      id: newId,
      title: noteRequest.title,
      text: noteRequest.text,
    };
    notes.push(newNote);
    res.json(newNote);
    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(notes, null, 2),
      function (err) {
        if (err) throw err;
      }
    );
  });
});

// Delete the note with id from db.json

app.delete("/api/notes/:id", (request, response) => {
  const deletedId = request.params.id;
  fs.readFile("./db/db.json", "utf8", (err, res) => {
    if (err) {
      console.log(err);
    }
    let notes = JSON.parse(res);
    if (deletedId <= notes.length) {
      // remove the element from the array
      response.json(notes.splice(deletedId - 1, 1));

      // renew ids for notes
      for (let i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
      }

      fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (error) => {
        if (error) throw error;
      });
    } else {
      response.json(false);
    }
  });
});

// Starts the server to begin listening
app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
