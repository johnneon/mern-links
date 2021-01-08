require('dotenv').config();
import express = require('express');
import auth from './routes/auth';
import links from './routes/link';
import redirect from './routes/redirect';
import mongoose = require("mongoose");
import path = require('path');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://licht:kRLLpTyyg4fYOatB@mern.go2z1.mongodb.net/mern?retryWrites=true&w=majority';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/link', links);
app.use('/t', redirect);

if (process.env.NODE_ENV === 'prodaction') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.warn(e.message);
    process.exit(1);
  }
}

app.listen(PORT, () => console.log(`Done! On port: ${PORT}`));

start();