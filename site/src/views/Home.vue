<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->

    <hr />

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
      <button v-on:click="submitFile()">Submit</button><br /><br />
      <div>
        Progress:
        <div style="display: inline-block" v-html="progressPercentage"></div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";

const API_URL = "http://localhost:3000";

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
      let formData = new FormData();
      formData.append("file", this.file);

      axios
        .post(API_URL + "/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function () {
          console.log("SUCCESS!!");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>
