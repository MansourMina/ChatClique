<template>
  <div class="blue-grey lighten-5" style="height: 100%">
    <v-list color="transparent" class="pl-0 ml-0">
      <v-list-item class="mt-4 pl-2 ml-0">
        <v-btn icon @click="$emit('close')" aria-label="Go Back" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Add group members
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-container class="mx-0 mt-10 px-0 pt-0 pb-10 text-center">
      <v-form ref="form" v-model="valid" lazy-validation>
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
            <div v-if="imageFile">
              <v-avatar
                size="200"
                @mouseover="showChange = true"
                @mouseleave="showChange = false"
                :class="showChange ? 'default' : ''"
              >
                <img
                  v-if="!showChange"
                  alt="Avatar"
                  :src="imageFile"
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
                  style="
                    position: absolute;
                    display: grid;
                    justify-items: center;
                  "
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
                src="@/assets/placeholder-group.png"
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
        <v-card class="mt-10 px-4" flat style="text-align: left">
          <v-card-text class="pl-3">Group Members</v-card-text>

          <v-autocomplete
            v-model="selectedFriends"
            :items="friends"
            chips
            color="transparent"
            label="Select friends"
            multiple
            class="elevation-0"
            clearable
            solo
            flat
            :rules="[(v) => !!v.length != 0 || 'Atleast 1 friend is required']"
            required
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click:close="remove(data.select)"
                color="#006bff"
                dark
              >
                <v-avatar left>
                  <v-img v-if="data.item.image" :src="data.item.image"></v-img>
                  <v-img v-else src="@/assets/placeholder.jpg"></v-img>
                </v-avatar>
                {{ data.item.username }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar>
                  <v-img v-if="data.item.image" :src="data.item.image"></v-img>
                  <v-img v-else src="@/assets/placeholder.jpg"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    data.item.username
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </v-card>
        <v-card class="mt-10 px-4" flat style="text-align: left">
          <v-card-text class="pl-3">Group subject</v-card-text>
          <v-text-field
            solo
            ref="name"
            :readonly="readonly"
            flat
            dense
            v-model.trim="subject"
            :clearable="!readonly"
            color="#006bff"
            placeholder="Subject"
            :rules="subjectRules"
            required
          ></v-text-field>
        </v-card>
      </v-form>
      <v-btn
        class="mt-10"
        icon
        color="#006bff"
        v-show="subject.length > 0 && selectedFriends.length > 0"
        @click="createGroup()"
      >
        <v-icon large>mdi-check</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    friends: {
      type: Array,
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      searchFriend: '',
      selectedFriends: [],
      showChange: false,
      imageFile: null,
      subject: '',
      readonly: false,
      subjectRules: [(v) => !!v || 'Subject is required'],
      valid: true,
    };
  },

  methods: {
    remove(item) {
      this.selectedFriends = this.selectedFriends.filter(
        (friend) => friend.user_id != item.user_id,
      );
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
    async createGroup() {
      this.selectedFriends.push(this.user);
      await axios({
        url: '/group',
        method: 'POST',
        data: {
          group_name: this.subject,
          created_by_user_id: this.user.user_id,
          created_date: new Date(),
          members: this.selectedFriends,
          chat_image: this.imageFile
        },
      });
    },
  },
};
</script>

<style scoped>
.default:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 60, 71, 0.6);
}
</style>
