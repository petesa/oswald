import express from 'express';
import path from 'path';
import main from './main';
import api from './api';

const server = express();

server.use(express.static(path.join(__dirname, '../dist')));

server.use('/api', api);
server.use('*', main);

server.listen(3000);
console.log('Server ready');
