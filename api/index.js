const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
  dest: 'uploads/'
});
const fs = require('fs');

const { Pool } = require("pg");

const Settings = require("./settings");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dev-bakelights",
  password: Settings.postgres_password,
  port: "5432"
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

  const client = await pool.connect();
  client.query(
    `INSERT INTO public.job(filename, originalname, path, mimetype, size, status) VALUES('${file.filename}', '${file.originalname}', '${file.path}', '${file.mimetype}', ${file.size}, 'pending')`,
    (err, res1) => {
      console.log(err, res1);

      res.status(200);
      res.end(JSON.stringify({ ok: true, data: {} }, null, 2));

      client.end();
    }
  );

});

app.get('/', async (req, res) => {
  res.status(200);
  res.end(JSON.stringify({ ok: true, data: {} }, null, 2));
});

app.listen(Settings.port, () => {
  console.log(`Example app listening at http://localhost:${Settings.port}`)
});

setInterval(async function () {
  const client = await pool.connect();
  client.query("WITH cte AS (SELECT * FROM public.job WHERE status='pending' ORDER BY createdat LIMIT 1) UPDATE job s SET status='running' FROM cte WHERE s.id=cte.id RETURNING s.*", (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    for (let row of res.rows) {
      console.log(row);
    }
    client.end();
  });
}, 5000);