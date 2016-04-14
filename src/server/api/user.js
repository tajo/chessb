import express from 'express';
import {UserModel} from '../db';
import shortid from 'shortid';
import bcrypt from 'bcrypt';
import {SALT_ROUNDS} from '../../common/constants';
import {validate} from '../../browser/components/signup';

const router = express.Router();

router
  .route('/user')
    .post((req, res) => {
      const v = validate({userId: req.body.newUserId, email: req.body.email, password: req.body.password});
      if (v.userId) {
        res.status(400).send({ err: `Username ${v.userId}` });
      } else if (v.password) {
        res.status(400).send({ err: `Password ${v.password}` });
      } else if (v.email) {
        res.status(400).send({ err: `Email ${v.email}` });
      } else {
        const user = new UserModel({
          userId: req.body.newUserId,
          token: shortid.generate(),
          password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
          email: req.body.email,
        });
        user.save(err => {
          if (err) {
            if (err.errmsg.includes('duplicate key error index: chessb.users.$userId')) {
              res.status(400).send({ err: 'User name already exists!' });
            } else if (err.errmsg.includes('duplicate key error index: chessb.users.$email')) {
              res.status(400).send({ err: 'Email already exists!' });
            } else {
              res.status(400).send({ err: errmsg });
            }
          } else {
            res.status(200).send({ msg: `User '${user.userId}' was saved.`, payload: user });
          }
        });
      }
    });

router
  .route('/user/signin')
    .post((req, res) => {
      if (!req.body.userId || !req.body.password) {
        res.status(400).send({ err: 'User name or password cannot be empty!' });
      } else {
        UserModel.findOne({$or:[{userId: req.body.userId}, {email: req.body.userId}]},
          (err, user) => {
            if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
              res.status(400).send({ err: 'User was not found!' });
            } else {
              res.status(200).send({ msg: `User '${req.body.userId}' found.`, payload: user });
            }
          });
      }
    });

export default router;
