const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const boardRoutes     = require('./routes/boardRoutes');
const listRoutes      = require('./routes/listRoutes');
const cardRoutes      = require('./routes/cardRoutes');
const memberRoutes    = require('./routes/memberRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const labelRoutes     = require('./routes/labelRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/boards',     boardRoutes);
app.use('/api/lists',      listRoutes);
app.use('/api/cards',      cardRoutes);
app.use('/api/members',    memberRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/labels',     labelRoutes);

module.exports = app;