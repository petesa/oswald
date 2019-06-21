/* eslint function-paren-newline: ["error", "consistent"] */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import App from '../client/App';
import template from './template';
import favicon from '../client/assets/favicon.ico';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const context = {};
  const appString = renderToString(
    <StaticRouter
      location={req.originalUrl}
      context={context}
    >
      <App />
    </StaticRouter>,
  );
  res.send(template({
    body: appString,
    icon: favicon,
    title: 'Hello World from the server',
  }));
});

module.exports = router;
