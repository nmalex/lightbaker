const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
  dest: 'uploads/'
});
const fs = require('fs');

const { Pool, Client } = require("pg");

const Settings = require("./settings");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dev-bakelights",
  password: Settings.postgres_password,
  port: "5432"
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/upload', upload.single('file'), async function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  const file = req.file;

  pool.query(
    `INSERT INTO public.job(filename, originalname, path, mimetype, size) VALUES('${file.filename}', '${file.originalname}', '${file.path}', '${file.mimetype}', ${file.size})`,
    (err, res1) => {
      console.log(err, res1);

      res.status(200);
      res.end(JSON.stringify({ ok: true, data: {} }, null, 2));
    }
  );
});

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
});

const cpUpload = upload.fields([{
  name: 'avatar',
  maxCount: 1
}, {
  name: 'gallery',
  maxCount: 8
}]);

app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

app.get('/', async (req, res) => {

  res.status(200);
  res.end(JSON.stringify({ ok: true, data: {} }, null, 2));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});