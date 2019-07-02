const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const playerRoutes = express.Router();
const PORT = 4000;

let Player = require('./Player.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Players', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

playerRoutes.route('/').get(function(req, res) {
    Player.find(function(err, players) {
        if (err) {
            console.log(err);
        } else {
            res.json(players);
        }
    });
});

playerRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Player.findById(id, function(err, player) {
        res.json(player);
    });
});

playerRoutes.route('/update/:id').post(function(req, res) {
    Player.findById(req.params.id, function(err, player) {
        if (!player)
            res.status(404).send("data is not found");
        else
            player.player_description = req.body.player_description;
            player.player_team = req.body.player_team;
            player.player_position = req.body.player_position;
            player.player_scratch = req.body.player_scratch;

            player.save().then(player => {
                res.json('Player updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

playerRoutes.route('/add').post(function(req, res) {
    let player = new Player(req.body);
    player.save()
        .then(player => {
            res.status(200).json({'player': 'player added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new player failed');
        });
});

playerRoutes.route('/delete/:id').delete(function (req, res) {
    Player.findByIdAndRemove(req.params.id, function(err){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

app.use('/players', playerRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});