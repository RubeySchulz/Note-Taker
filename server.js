const path = require('path');
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const database = require('./db/db.json');
let notes = database;


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

function save(array){
    fs.writeFile(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(array, null, 2),
        (err) => {
            if(err) {
                console.log(err);
            }
        }
    )
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.post('/api/notes', (req, res) => {
    req.body.id = uuidv4();
    let result = notes
    result.push(req.body);
    save(result);
    notes = result;
    res.json(result);
});

app.delete('/api/notes/:id', (req, res) => {
    let result = notes.filter(note => note.id !== req.params.id);
    save(result);
    notes = result;
    res.json(result);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server now live on http://localhost:${PORT}`);
});