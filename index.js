const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v1: uuidv1 } = require('uuid');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

const dbName = 'todo_db';
const tableName = 'todos';

db.connect(error => {
    if (error) throw error.message;
    console.log('Connected to the MYSQL database');

    db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function (err, result) {
        if (err) throw err;
        console.log(`Database created: ${dbName}`);
    });
    db.query(`USE ${dbName}`, function (err, result) {
        if (err) throw err;
        console.log(`Using ${dbName} database`);
    });
    db.query(`CREATE TABLE IF NOT EXISTS todos (id VARCHAR(255), todo VARCHAR(255))`, function (err, result) {
        if (err) throw err;
        console.log(`Table created: ${tableName}`);
    });
});

app.listen(8080, function() {
    console.log('listening on 8080');
});

app.get('/todos', function (req, res) {
    db.query(`SELECT * FROM ${tableName}`, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log('List of todos: ', result);
        res.send(result);
    });
});

app.post('/todos', function (req, res) {
    const { todo } = req.body;
    const id = uuidv1();

    db.query(`INSERT INTO ${tableName} (id, todo) VALUES ('${id}', '${todo}')`, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Added todo ${todo} with id=${id}: `, result);
        res.sendStatus(200);
    });
});

app.delete('/todos', function (req, res) {
    const { id } = req.body;

    db.query(`DELETE FROM ${tableName} WHERE id = '${id}';`, (err, result) => {
        if (err) res.status(500).send(err.message);

        console.log(`Deleted todo with id=${id}: `, result);
        res.sendStatus(200);
    });
});