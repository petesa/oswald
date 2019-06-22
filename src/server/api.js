import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Translate } from '@google-cloud/translate';

const router = express.Router();

const {
  GOOGLE_APPLICATION_CREDENTIALS,
  PROJECT_ID,
} = process.env;

console.log(GOOGLE_APPLICATION_CREDENTIALS);

/* router.get('*', (req, res, next) => {
  if (req.xhr) {
    next();
  } else {
    res.redirect('/');
  }
}); */

router.get('/:lang/:text', async (req, res) => {
  res.charset = 'UTF-8';
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  const { text, lang } = req.params;
  let translation;
  let response;
  try {
    translation = await makeTranslation(text, lang);
    response = {
      status: 200,
      lang,
      text,
      translation,
    };
  } catch (error) {
    response = {
      status: 500,
      error,
    };
  }
  res.write(JSON.stringify(response));
  res.end();
});

async function makeTranslation(text, lang) {
  const translate = new Translate({ PROJECT_ID });
  const [translation] = await translate.translate(text, lang);
  return translation;
}

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

module.exports = router;
