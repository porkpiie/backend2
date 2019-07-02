const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Player = new Schema({
    player_description: {
        type: String
    },
    player_team: {
        type: String
    },
    player_position: {
        type: String
    },
    player_scratch: {
        type: Boolean
    }
});

module.exports = mongoose.model('Player', Player);


