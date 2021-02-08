const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v1: uuidv1 } = require('uuid');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbName = 'todo_db';
const collectionName = 'todos';
const url = `mongodb://127.0.0.1:27017`;

mongoose.connect(`${url}/${dbName}`, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.once('open', () => {
    console.log('Connected to the MongoDB database');
});

const collectionSchema = new mongoose.Schema(
    {
        id: {
            type: String
        },
        todo: {
            type: String
        }
    },
    {
        collection: collectionName
    }
);

const todos = mongoose.model(collectionName, collectionSchema);

app.listen(8080, () => {
    console.log('listening on 8080');
});

app.get('/todos', async(req, res) => {
    todos.find({}, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log('List of todos: ', result);
        res.send(result);
    });
});

app.post('/todos', async(req, res) => {
    const { todo } = req.body;
    const id = uuidv1();

    todos.create({ id, todo }, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Added todo ${todo} with id=${id}: `, result);
        res.sendStatus(200);
    });
});

app.delete('/todos', (req, res) => {
    const { id } = req.body;

    todos.deleteOne({ id }, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Deleted todo with id=${id}: `, result);
        res.sendStatus(200);
    });
});

