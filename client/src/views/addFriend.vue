<template>
  <div style="height: 100%">
    <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
      <v-list color="transparent" class="pl-0 ml-0">
        <v-list-item class="mt-4 pl-0 ml-0">
          <v-btn icon @click="$emit('close')" class="mr-3">
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Add new friends
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-app-bar>

    <v-text-field
      placeholder="username#0000 "
      class="pa-4"
      hide-details
      clearable
      v-model="searchAddNewFriend"
    >
      <template v-slot:prepend>
        <v-icon class="ml-2 mr-3">mdi-magnify</v-icon>
      </template>
    </v-text-field>

    <v-divider></v-divider>

    <v-list
      three-line
      class="mt-0 pt-0"
      style="overflow-y: scroll"
      max-height="80vh"
      v-for="user in searchUser"
      :key="user.user_id"
    >
      <v-list-item>
        <v-list-item-avatar class="mt-6">
          <v-img src="@/assets/placeholder.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="mt-6">
          <v-list-item-action-text>
            <v-btn
              icon
              @click="$emit('addFriend', user)"
              v-if="statusOfSearch == 'request'"
              ><v-icon>mdi-account-plus-outline</v-icon></v-btn
            >
            <v-icon color="green" v-if="statusOfSearch == 'friend'" class="mt-2"
              >mdi-account-multiple-check</v-icon
            >
            <v-icon v-if="statusOfSearch == 'requested'" class="mt-2"
              >mdi-account-clock</v-icon
            >

            <span v-if="statusOfSearch == 'for you'">
              <v-btn icon>
                <v-icon color="red darken-2">mdi-close-circle</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon color="#00a884" @click="acceptRequest()"
                  >mdi-check-circle</v-icon
                >
              </v-btn>
            </span>
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    users: {
      type: Array,
    },
    ownUser: {
      type: Object,
    },
    friends: {
      type: Array,
    },
    requests: {
      type: Array,
    },
  },
  data() {
    return {
      searchAddNewFriend: '',
    };
  },
  computed: {
    searchUser() {
      return this.users.filter(
        (el) =>
          `${el.username.toLowerCase()}#${el.user_id}` ==
            this.searchAddNewFriend.toLowerCase() &&
          el.user_id != this.ownUser.user_id,
      );
    },
    statusOfSearch() {
      if (
        this.friends.find(
          (friend) =>
            `${friend.username.toLowerCase()}#${friend.user_id}` ==
            this.searchAddNewFriend.toLowerCase(),
        )
      )
        return 'friend';
      else if (
        this.requests.find(
          (request) =>
            `${request.to_username.toLowerCase()}#${request.to_user_id}` ==
            this.searchAddNewFriend.toLowerCase(),
        )
      )
        return 'requested';
      else if (
        this.requests.find(
          (request) =>
            `${request.from_username.toLowerCase()}#${request.from_user_id}` ==
            this.searchAddNewFriend.toLowerCase(),
        )
      )
        return 'for you';
      else return 'request';
    },
  },
  methods: {
    async acceptRequest() {
      let findRequest = this.requests.find(
        (request) =>
          `${request.from_username.toLowerCase()}#${request.from_user_id}` ==
          this.searchAddNewFriend.toLowerCase(),
      );
      console.log(findRequest);
      await axios({
        url: '/friendship',
        method: 'POST',
        data: {
          request_id: findRequest.request_id,
          user1_id: findRequest.to_user_id,
          user2_id: findRequest.from_user_id,
          date: new Date(),
        },
      });
      this.$emit('update');
    },
  },
};
</script>

<style lang="scss" scoped></style>
