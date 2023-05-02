<template>
  <v-card class="web-camera-container">
    <v-btn icon dark color="black" @click="close" large>
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div v-if="isCameraOpen" v-show="!isLoading" style="position: relative">
      <span style="background-color: black"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam voluptate
        sit odit quasi aspernatur, dolore explicabo molestiae perspiciatis
        inventore, deserunt quia iste rerum error minus eveniet a, optio neque?
        Distinctio.</span
      >
      <video ref="camera" width="450" autoplay></video>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isCameraOpen: true,
      isLoading: false,
    };
  },
  created() {
    this.createCameraElement();
  },
  methods: {
    close() {
      this.stopCameraStream();
      this.$emit('close');
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch(() => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
