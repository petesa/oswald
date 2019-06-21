import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();

router.get('*', (req, res, next) => {
  if (req.xhr) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/', (req, res, next) => {
  res.charset = 'UTF-8';
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.write('{}');
  res.end();
});

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

module.exports = router;
