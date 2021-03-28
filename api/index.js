const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
  dest: 'uploads/'
});
const fs = require('fs');
const path = require('path');
const axios = require("axios");

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

async function doconvert(stpFileUrl) {
  const apiKey = "75f5-4d53-b0f4";
  const workspaceGuid = "55a0bd33-9f15-4bc0-a482-17899eb67af3";
  const baseUrl = "https://api2.renderfarmjs.com/v1";
  const workgroup = "dev";
  
  var response = await axios.post(baseUrl + '/session', {
    api_key: apiKey,
    workgroup: workgroup,
    workspace_guid: workspaceGuid,
    scene_filename: null,
    //
    debug: additonalParams && additonalParams.debug,
  });
  const session = response.data.data;
  console.log(` >> session: `, session);


  var response2 = await axios.post(baseUrl + '/job/convert', {
    session_guid: session.guid,
    job_type: "convert",
    input_url: stpFileUrl,
    settings: {}
  }, {
    timeout: 15 * 60 * 1000, // 15min timeout
  });

  const job = response2.data.data;
  console.log(" >> job: ", job);

  let i = 50;
  let timer;
  var p = new Promise(function (resolve, reject) {

    timer = setInterval(async function () {
      try {
        let url = baseUrl + '/job/' + job.guid;
        console.log(" >> GET job: ", url);
        var response = await axios.get(url, {});
        console.log(" >> job: ", response.data.data);
        if (response.data.data.closed) {
          resolve();
        }
      } catch (err) {
        console.log(" >> job err: ", err.message);
        reject();
      }

      i = i - 1;
      if (i <= 0) resolve();

    }, 1000);

  });

  await p;

  var response3 = await axios.delete(baseUrl + '/session/' + session.guid, {});
  console.log(` >> session closed: `, response3.data.data);

  clearInterval(timer);

}

app.post('/upload', upload.single('file'), async function (req, res, next) {
  // req.file is the file
  // req.body will hold the text fields, if there were any

  const file = req.file;

  const fileExt = path.extname(file.originalname);
  const newFileName = `${file.filename}${fileExt}`;
  fs.renameSync(file.filename, newFileName);

  const client = await pool.connect();
  client.query(
    `INSERT INTO public.job(filename, originalname, path, mimetype, size, status) VALUES('${newFileName}', '${file.originalname}', '${file.path}', '${file.mimetype}', ${file.size}, 'pending')`,
    (err, res1) => {
      console.log(err, res1);

      let p = await doconvert();

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

app.get('/file/:filename', async (req, res) => {
    const file = `/upload/${req.params.filename}`;
    res.download(file); // Set disposition and send it.
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