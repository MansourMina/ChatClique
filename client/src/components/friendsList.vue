<template>
  <div style="background-color: white">
    <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
      <v-list color="transparent" class="pl-0 ml-0">
        <v-list-item class="mt-4 pl-0 ml-0">
          <v-btn icon @click="$emit('close')" aria-label="Go Back">
            <v-icon class="mr-3" color="white">mdi-arrow-left</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Friends
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-app-bar>
    <v-container>
      <v-list subheader two-line>
        <v-subheader
          >Online
          <v-icon color="green accent-4">mdi-circle-medium</v-icon></v-subheader
        >

        <v-list-item v-for="friend in online" :key="friend.user_id">
          <v-list-item-avatar size="50">
            <v-img width="50" v-if="friend.image" :src="friend.image"></v-img>
            <v-img v-else src="@/assets/placeholder.jpg" width="50"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            
            <v-list-item-title>{{ friend.name }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-subheader
          >Offline <v-icon color="red">mdi-circle-medium</v-icon></v-subheader
        >
        <v-list-item v-for="friend in offline" :key="friend.user_id">
          <v-list-item-avatar size="50">
            <v-img width="50" v-if="friend.image" :src="friend.image"></v-img>
            <v-img v-else src="@/assets/placeholder.jpg" width="50"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ friend.name }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-subheader>Requests</v-subheader>

        <v-list-item v-for="request in requests" :key="request.request_id">
          <v-list-item-avatar>
            <v-img src="@/assets/placeholder.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              request.requested_username
            }}</v-list-item-title>

            <v-list-item-subtitle>{{
              request.requested_date
            }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <div>
              <v-btn icon>
                <v-icon color="red darken-2">mdi-close-circle</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon color="#00a884" @click="acceptRequest(request)"
                  >mdi-check-circle</v-icon
                >
              </v-btn>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      friends: [],
    };
  },
  props: {
    user: {
      type: Object,
    },
    requests: {
      type: Array,
    },
    onlineFriends: {
      type: Array,
    },
  },
  created() {
    this.getFriends();
  },
  computed: {
    online() {
      return this.onlineFriends.filter(
        (user) => user.user_id != this.user.user_id,
      );
    },
    offline() {
      return this.friends.filter(
        (friend) => !this.online.map((o) => o.user_id).includes(friend.user_id),
      );
    },
  },
  methods: {
    async acceptRequest(request) {
      await axios({
        url: 'http://localhost:3000/friendship',
        method: 'POST',
        data: {
          request_id: request.request_id,
          user1_id: this.user.user_id,
          user2_id: request.from_user_id,
          date: new Date(),
        },
      });
    },
    async getFriends() {
      const { data } = await axios({
        url: 'http://localhost:3000/friends/' + this.user.user_id,
        method: 'GET',
      });
      this.friends = data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
