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
      <div v-html="progressPercentage"></div>
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
      progressPercentage: 90,
    };
  },

  methods: {
    submitFile() {
      var bucket = new AWS.S3({
        accessKeyId: "AKIAYYBKYWW37UJNJB5L",
        secretAccessKey: "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",
        region: "eu-central-1",
      });

      const folderName = "folder1";

      const uploadfile = function (fileName, file, folderName) {
        const params = {
          Bucket: "dev2.bakelights.com",
          Key: folderName + "/" + fileName,
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

      let upload1 = uploadfile(this.file.name, this.file, folderName);
      upload1.on("httpUploadProgress", function (progress) {
        let progressPercentage =
          Math.round((progress.loaded / progress.total) * 1000) / 10;
        console.log(progressPercentage);
        this.progressPercentage = progressPercentage;
      }.bind(this));
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>
