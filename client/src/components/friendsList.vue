<template>
  <v-container style="height: 100vh; background-color: white" fluid>
    <v-app-bar color="#00a884" height="100" elevation="0" app rounded="0">
      <v-tabs v-model="tab">
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-list subheader two-line color="transparent">
      <v-subheader inset>Requests</v-subheader>

      <div v-if="requests.length > 0">
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
      </div>
      <div v-else>No Requests</div>
    </v-list>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      requests: [],
      tab: null,
      items: [
        { tab: 'Online', content: 'Tab 1 Content' },
        { tab: 'All', content: 'Tab 2 Content' },
        { tab: 'requested', content: 'Tab 3 Content' },
        { tab: 'Add friend', content: 'Tab 4 Content' },
      ],
    };
  },
  props: {
    user: {
      type: Object,
    },
  },
  created() {
    this.getRequests();
  },

  methods: {
    async getRequests() {
      const { data } = await axios({
        url: 'http://localhost:3000/requests/' + this.user.user_id,
      });
      this.requests = data;
    },
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
      this.getRequests();
    },
  },
};
</script>

<style lang="scss" scoped></style>
