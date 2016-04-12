import express from 'express';
import {UserModel} from '../db';
import shortid from 'shortid';
import bcrypt from 'bcrypt';
import {SALT_ROUNDS} from '../../common/constants';

const router = express.Router();

router
  .route('/user')
    .post((req, res) => {
      const user = new UserModel({
        userId: req.body.newUserId,
        token: shortid.generate(),
        password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
        email: req.body.email,
      });
      user.save(err => {
        if (err) {
          res.status(400).send({ msg: err });
        } else {
          res.status(200).send({ msg: `User '${user.userId}' was saved.`, payload: user });
        }
      });
    });

export default router;
