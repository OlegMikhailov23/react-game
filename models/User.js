const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    win: {type: Number, default: 0},
    lose: {type: Number, default: 0}
});

module.exports = model('User', schema);
