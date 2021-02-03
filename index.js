import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v1 as uuidv1 } from 'uuid';
import mysql from 'mysql';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

db.connect(error => {
    if (error) throw error.message;

    console.log('Successfully connected to the database.');
});

app.listen(8080, function() {
    console.log('listening on 8080');
});

app.get('/todos', function (req, res) {
    db.query('SELECT * FROM todos', (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log('List of todos: ', result);
        res.send(result);
    });
});

app.post('/todos', function (req, res) {
    const { todo } = req.body;
    const id = uuidv1();

    db.query(`INSERT INTO todos (id, todo) VALUES ('${id}', '${todo}')`, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Added todo ${todo} with id=${id}: `, result);
        res.sendStatus(200);
    });
});

app.delete('/todos', function (req, res) {
    const { id } = req.body;

    db.query(`DELETE FROM todos WHERE id = '${id}';`, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Deleted todo with id=${id}: `, result);
        res.sendStatus(200);
    });
});