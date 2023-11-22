<template>
  <div style="background-color: white; height: 100%">
    <v-list color="transparent" class="pl-0 ml-0">
      <v-list-item class="mt-4 pl-2 ml-0">
        <v-btn icon @click="$emit('close')" aria-label="Go Back" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Friends </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-container
      style="overflow: hidden; height: 100%"
      class="mx-0 px-0 pt-0 pb-10"
    >
      <v-list
        class="mt-0 pt-0"
        subheader
        two-line
        style="overflow: scroll; height: 100%"
      >
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
            <v-list-item-title>{{ friend.username }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="$emit('setCurrentUserChat', friend)">
              <v-icon color="#006bff">mdi-message-text</v-icon>
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
            <v-list-item-title>{{ friend.username }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="$emit('setCurrentUserChat', friend)">
              <v-icon color="#006bff">mdi-forum-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-subheader>Requests</v-subheader>

        <v-list-item v-for="request in filterRequest" :key="request.request_id">
          <v-list-item-avatar>
            <v-img src="@/assets/placeholder.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ request.from_username }}</v-list-item-title>

            <v-list-item-subtitle>{{
              getTime(request.requested_date)
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
    onlineFriends : {
      type: Array,
    },
  },
  async created() {
    await this.getFriends();
  },
  computed: {
    online() {
      return this.onlineFriends.filter((user) =>
        this.friends.map((o) => o.user_id).includes(user.user_id),
      );
    },
    offline() {
      return this.friends.filter(
        (friend) => !this.online.map((o) => o.user_id).includes(friend.user_id),
      );
    },
    filterRequest() {
      return this.requests.filter(
        (request) => this.user.user_id == request.to_user_id,
      );
    },
  },
  methods: {
    async acceptRequest(request) {
      await axios({
        url: '/friendship',
        method: 'POST',
        data: {
          request_id: request.request_id,
          user1_id: this.user.user_id,
          user2_id: request.from_user_id,
          date: new Date(),
        },
      });
      this.$emit("refreshRequests");
      this.getFriends();
    },
     
    async getFriends() {
      const { data } = await axios({
        url: '/friends/' + this.user.user_id,
        method: 'GET',
      });
      this.friends = data;
    },
    getTime(messageDate) {
      let date = new Date(messageDate);
      return date.toDateString().slice(0, date.toDateString().length - 5);
    },
  },
};
</script>

<style lang="scss" scoped></style>
