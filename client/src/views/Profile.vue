<template>
  <div style="height: 100%" class="blue-grey lighten-5">
    <v-list color="transparent" class="pl-0 ml-0">
      <v-list-item class="mt-4 pl-2 ml-0">
        <v-btn icon @click="$emit('close')" aria-label="Go Back" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Profile </v-list-item-title>
        </v-list-item-content>
        <v-btn
          text
          :disabled="!imageFile && this.user.name == name"
          @click="updateProfile()"
          color="#006bff"
        >
          Save
        </v-btn>
      </v-list-item>
    </v-list>

    <v-container class="mt-5 text-center" fluid>
      <div>
        <input
          ref="uploader"
          class="d-none"
          type="file"
          @input="onFileChanged"
          accept="image/png, image/jpeg"
        />
        <v-btn
          x-large
          fab
          @click="handleFileImport"
          style="width: 200px; height: 200px"
          aria-label="Change Profile Image"
        >
          <div v-if="user.image || imageFile">
            <v-avatar
              size="200"
              @mouseover="showChange = true"
              @mouseleave="showChange = false"
              :class="showChange ? 'default' : ''"
            >
              <img
                v-if="!showChange"
                alt="Avatar"
                :src="imageFile ? imageFile : user.image"
                name="Profile Picture"
              />
              <img
                v-if="showChange"
                alt="Avatar"
                :src="imageFile ? imageFile : user.image"
                name="Profile Picture"
              />
              <div
                v-if="showChange"
                style="position: absolute; display: grid; justify-items: center"
                class="white--text"
              >
                <v-icon>mdi-camera-plus</v-icon>
                <span class="body-2 mt-3" width="20"
                  >change profile <br />
                  picture</span
                >
              </div>
            </v-avatar>
          </div>

          <v-avatar v-else size="200" class="default">
            <img
              alt="Avatar"
              src="@/assets/placeholder.jpg"
              name="Profile Picture"
            />
            <div
              style="position: absolute; display: grid; justify-items: center"
              class="white--text"
            >
              <v-icon>mdi-camera-plus</v-icon>
              <span class="body-2 mt-3" width="20"
                >add profile <br />
                picture</span
              >
            </div>
          </v-avatar>
        </v-btn>
      </div>
    </v-container>
    <v-card class="mt-10 px-4 pb-2" flat style="text-align: left">
      <v-card-text class="pl-3">Your name</v-card-text>
      <v-text-field
        solo
        ref="name"
        :readonly="readonly"
        flat
        dense
        v-model="name"
        :clearable="!readonly"
        :append-icon="readonly ? 'mdi-pencil' : ''"
        @click:append="(readonly = !readonly), $refs['name'].focus()"
        hide-details
        color="#006bff"
      ></v-text-field>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      imageFile: null,
      showChange: false,
      readonly: true,
      name: this.user.name,
    };
  },
  methods: {
    handleFileImport() {
      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      const file = e.target.files[0];

      await this.getBase64(file).then((data) => {
        this.imageFile = data;
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        return Promise.resolve(reader.result);
      });
    },
    updateProfile() {
      let dataToSend = {};
      this.imageFile ? (dataToSend.image = this.imageFile) : false;
      this.user.name != this.name ? (dataToSend.name = this.name) : false;
      this.$emit('updateProfile', dataToSend);
    },
  },
};
</script>

<style lang="css" scoped>
.default:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 60, 71, 0.6);
}

.v-text-field >>> input {
  font-size: 0.9em;
}
</style>
