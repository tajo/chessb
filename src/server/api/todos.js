import express from 'express';

const router = express.Router();

const todos = {
  asdasd: 'asd'
};

router.route('/user')
  .get((req, res) => {
    // Simulate async access.
    // In real app we would check user credentials and load user data from DB.
    setTimeout(() => {
      res.status(200).send({todos}).end();
    }, 50);
  });

export default router;
