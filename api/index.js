const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
  dest: 'uploads/'
});
const fs = require('fs');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
// Create S3 service object
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// TODO: see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/profile', upload.single('file'), async function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  const file = req.file;
  fs.readFile(file.path, function (err, data) {
    if (err) throw err; // Something went wrong!
    const s3bucket = new AWS.S3({ params: { Bucket: 'dev1.bakelights.com' } });
    s3bucket.createBucket(function () {
      const params = {
        Key: file.originalname, //file.name doesn't exist as a property
        Body: data
      };
      s3bucket.upload(params, function (err, data) {
        // Whether there is an error or not, delete the temp file
        fs.unlink(file.path, function (err) {
          if (err) {
            console.error(err);
          }
        });

        if (err) {
          res.status(500).end();
        } else {
          res.status(201).send(data); // JSON.stringify({ ok: true,  })
        }
      });
    });
  });
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

  // Call S3 to list the buckets
  s3.listBuckets(function (err, data) {
    if (err) {
      res.status(500);
      res.end(JSON.stringify({ ok: false, message: err.message }, null, 2));
    } else {
      res.status(200);
      res.end(JSON.stringify({ ok: true, data: data.Buckets }, null, 2));
    }
  });

});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});