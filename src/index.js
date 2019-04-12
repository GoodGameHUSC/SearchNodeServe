import express from 'express';
import { app } from './consts';
//here routes defined
import './routes';

const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
// using the JSON body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.listen(3000, () => {
  console.log('Serve is running');
});
