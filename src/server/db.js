import mongoose, { Schema } from 'mongoose';
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chessb');
export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB.');
});

const userSchema = Schema({
  userId: { type: String, unique : true, required : true, dropDups: true },
  email: { type: String, unique : true, dropDups: true },
  password: String,
  token: { type: String, unique : true, required : true, dropDups: true },
  createdAt: { type: Date, default: Date.now },
});

const gameSchema = new Schema({}, {strict: false});

export const UserModel = mongoose.model('User', userSchema);
export const GameModel = mongoose.model('Game', gameSchema);
