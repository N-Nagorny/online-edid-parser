// External dependencies
const bodyParser = require('body-parser');
const express = require('express');
const edidParser = require('edid-parser');
const path = require('path');

// Constants
const PORT = process.env.PORT || 8081;
const HOST = '0.0.0.0';
const public_dir = path.join(__dirname, 'public')

// Express App
const app = express();
const api = express();
const frontend = express();
app.use(express.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

api.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

frontend.use('/public', express.static(public_dir));
console.log("Serving ", public_dir);
frontend.set('view engine', 'pug');
frontend.set('view options', { layout: false });

app.use(['/'], frontend);
app.use(['/api'], api);

frontend.get('/', function (req, res, next) {
  res.render('index', {
    title: "Home"
  });
});

api.post('/edid', async (req, res, next) => {
  console.log('/edid body: ', req.body);
  res.json({
    "edid": edidParser.parseEdidBinary(new Uint8Array(req.body))
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
