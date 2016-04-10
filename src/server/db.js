import mongoose, { Schema } from 'mongoose';
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chessb');
export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB.');
});

const userSchema = Schema({
  userId: String,
  password: String,
  token: String,
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model('User', userSchema);
