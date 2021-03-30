const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
  dest: 'uploads/'
});
const fs = require('fs');
const path = require('path');
const { uuid } = require('uuidv4');

const { Pool } = require("pg");

const Settings = require("./settings");

const pool = new Pool({
  user: Settings.postgres_user,
  host: Settings.postgres_host,
  database: Settings.postgres_database,
  password: Settings.postgres_password,
  port: Settings.postgres_port,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/upload', upload.single('file'), async function (req, res, next) {
  // req.file is the file
  // req.body will hold the text fields, if there were any

  const file = req.file;
  console.log(` >> file: `, file);

  const guid = uuid();

  const fileExt = path.extname(file.originalname);
  const newFileName = `${guid}${fileExt}`;
  const newFilePath = file.destination + newFileName;
  fs.renameSync(file.destination + file.filename, newFilePath);

  const client = await pool.connect();
  client.query(
    `INSERT INTO public.file(guid, filename, originalname, filepath, mimetype, filesize) VALUES('${guid}', '${newFileName}', '${file.originalname}', '${newFilePath}', '${file.mimetype}', ${file.size})`,
    (err, res1) => {
      console.log(` >> INSERT result: `, err, res1);

      res.status(200);
      res.end(JSON.stringify({ ok: true, data: { url: `${Settings.public_url}/file/${newFileName}` } }, null, 2));

      client.end();
    }
  );

});

app.get('/', async (req, res) => {
  res.status(200);
  res.end(JSON.stringify({ ok: true, data: {} }, null, 2));
});

app.get('/file/:filename', async (req, res) => {
  const file = `./uploads/${req.params.filename}`;
  res.download(file); // Set disposition and send it.
});

app.listen(Settings.port, () => {
  console.log(`API server is listening at http://localhost:${Settings.port}`)
});
