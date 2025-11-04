// srcc/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3333;


app.use(cors()); 
app.use(express.json());


app.use('/api/v1', routes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});