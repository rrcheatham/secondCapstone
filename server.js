require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { ExpenseData, UserData } = require('./models');

const { createDefaultBudget } = require('./users/defaultBudget');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

/* app.get('/expenses/budget', (req, res) => {
    var username = req.query.username;
    ExpenseData.insertMany(createDefaultBudget(username));
}); */

app.get('/expenses', jwtAuth, (req, res) => {
    ExpenseData
        .find({username: req.query.username})
        .then(expenses => {
            res.json({
                expenses: expenses.map(
                    (expense) => expense.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
});

app.get('/expenses/:id', jwtAuth, (req, res) => {
    ExpenseData
        .findById(req.params.id)
        .then(expense => res.json(expense.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
});

app.post('/expenses/add', jwtAuth, (req, res) => {
    const requiredFields = ['category', 'amount', 'month', 'type', 'username'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    ExpenseData
        .create({
            category: req.body.category,
            amount: req.body.amount,
            month: req.body.month,
            type: req.body.type,
            username: req.body.username
        })
        .then(expense => res.status(201).json(expense.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
});

app.put('/expenses/:id', jwtAuth, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json( {message: message});
    }
    const toUpdate = {};
    const updateableFields = ['category', 'amount', 'month', 'type'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    ExpenseData
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(expense => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

app.delete('/expenses/:id', jwtAuth, (req, res) => {
    ExpenseData
        .findByIdAndRemove(req.params.id)
        .then(expense => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error'}));
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });
  

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main == module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
