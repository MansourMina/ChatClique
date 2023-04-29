<template>
  <div style="height: 100%" class="blue-grey lighten-5 text-center">
    <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
      <v-list color="transparent" class="pl-0 ml-0">
        <v-list-item class="mt-4 pl-0 ml-0">
          <v-btn icon @click="$emit('close')" aria-label="Go Back">
            <v-icon class="mr-3" color="white">mdi-arrow-left</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Profile
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <v-btn text class="white--text mt-4" :disabled="!imageFile"> Save </v-btn>
    </v-app-bar>

    <v-container class="mt-5" fluid>
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
                :src="imageFile"
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

          <v-avatar size="200" v-else class="default">
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
        :append-icon="readonly ? 'mdi-pencil' : 'mdi-check'"
        @click:append="(readonly = !readonly), $refs['name'].focus()"
        hide-details
        color="green"
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
    clearFiles() {
      this.$nextTick(() => {
        this.$refs.fileinput.$el.click();
      });
    },
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
