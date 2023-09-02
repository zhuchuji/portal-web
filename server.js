const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('build', {
  index: false,
  fallthrough: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

app.listen(10001, () => {
  console.log(`Website runs on 10001`);
});