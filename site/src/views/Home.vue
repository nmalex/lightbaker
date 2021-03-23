<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->

    <div class="large-12 medium-12 small-12 cell">
      <label
        >File
        <input
          type="file"
          id="file"
          ref="file"
          v-on:change="handleFileUpload()"
        />
      </label>
      <button v-on:click="submitFile()">Submit</button> <br />
      <div id="myProgress">my progress</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import axios from "axios";

//const API_URL = "http://localhost:3000";
import AWS from "aws-sdk";

export default {
  name: "Home",
  components: {
    //    HelloWorld,
  },

  data() {
    return {
      file: "",
    };
  },

  methods: {
    submitFile() {
      var bucket = new AWS.S3({
        accessKeyId: "AKIAYYBKYWW3Z2AAHLSY",
        secretAccessKey: "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",
        region: "eu-central-1",
      });

      const uploadfile = function (fileName, file, folderName) {
        const params = {
          Bucket: "dev2.bakelights.com",
          Key: folderName + fileName,
          Body: file,
          ContentType: file.type,
        };
        return bucket.upload(params, function (err, data) {
          if (err) {
            console.log("There was an error uploading your file: ", err);
            return false;
          }
          console.log("Successfully uploaded file.", data);
          return true;
        });
      };

      let upload1 = uploadfile(uniqueFileName, file, folderName);
      upload1.on("httpUploadProgress", function (progress) {
        let progressPercentage =
          Math.round((progress.loaded / progress.total) * 1000) / 10;
        console.log(progressPercentage);
      });

      /* var formData = new FormData();
      formData.append("file", this.file);
      var xhr = new XMLHttpRequest();

      // your url upload
      xhr.open("post", `${API_URL}/profile`, true);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          var percentage = (e.loaded / e.total) * 100;
          console.log(percentage + "%");
        }
      };

      xhr.onerror = function (e) {
        console.log("Error");
        console.log(e);
      };
      xhr.onload = function () {
        console.log(this.statusText);
      };

      xhr.send(formData); */
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>
