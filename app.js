require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/db');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(cors());

app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/supplier', supplierRoutes);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
});