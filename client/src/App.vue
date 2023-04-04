<template>
  <v-app>
    <div v-if="user.user_id">
      <v-card style="background-color: #f4f1eb" tile>
        <v-navigation-drawer width="25%" statless app>
          <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
            <v-list color="transparent" class="pa-3">
              <v-list-item class="mt-4">
                <v-list-item-avatar>
                  <v-img
                    src="./assets/placeholder.jpg"
                    height="40"
                    width="20"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 white--text">
                    {{ user.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="white--text">{{
                    user.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-app-bar>

          <v-text-field
            placeholder="Suchen oder neuen Chat beginnen"
            class="pa-4"
            hide-details
            clearable
          >
            <template v-slot:prepend>
              <v-icon class="ml-2 mr-3">mdi-magnify</v-icon>
            </template>
          </v-text-field>
          <v-divider></v-divider>
          <v-list
            three-line
            class="mt-0 pt-0 mb-10"
            style="overflow-y: scroll"
            max-height="80vh"
          >
            <!-- <v-subheader v-if="item.header" :key="item.header"></v-subheader> -->

            <!-- <v-divider
                v-else-if="item.divider"
                :key="index"
                :inset="item.inset"
              ></v-divider> -->

            <v-list-item
              link
              class="pl-4 pr-3"
              v-for="chat in chats"
              :key="chat.user_id"
              @click="setFriendChat(chat)"
            >
              <v-list-item-avatar>
                <v-img
                  src="https://randomuser.me/api/portraits/women/85.jpg"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  chat.friend[0].username
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  chat.messages[chat.messages.length - 1].message
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <p>
                  <v-list-item-action-text>15 min ago</v-list-item-action-text>
                </p>

                <v-badge color="green" class="mr-3 ml-5 mt-3">
                  <span slot="badge">{{ 2 }}</span>
                </v-badge>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar
          color="#00a884"
          class="pa-3"
          height="100"
          elevation="0"
          app
          rounded="0"
        >
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

          <v-list-item>
            <v-list-item-avatar>
              <v-img
                src="./assets/placeholder.jpg"
                height="40"
                width="20"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-h6 white--text">
                {{
                  Object.keys(friendChat).length > 0
                    ? friendChat.friend[0].username
                    : ''
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-spacer></v-spacer>

          <v-btn icon color="white">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-btn icon color="white">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-app-bar>
        <v-main hide-overlay style="overflow: hidden">
          <router-view
            :chats="chats"
            :friendChat="friendChat"
            @addToChat="postMessage"
          />
        </v-main>
      </v-card>
    </div>
    <div v-else>
      <v-main><Login /></v-main>
    </div>
  </v-app>
</template>

<script>
import Login from '@/views/Login.vue';
import axios from 'axios';
export default {
  name: 'App',
  components: {
    Login,
  },
  data: () => ({
    ws: null,
    search: '',
    chats: [],
    friendChat: {},
    user: {},
  }),
  async created() {
    this.getUser();
    if (this.user.user_id != null) {
      await this.getChats();

      let friendChat = JSON.parse(localStorage.getItem('friendChat'));
      if (friendChat) this.friendChat = friendChat;
    }
  },
  methods: {
    async getChats() {
      const { data } = await axios({
        url: `http://localhost:3000/chats/${this.user.user_id}`,
        method: 'GET',
      });
      this.chats = data;
    },
    setFriendChat(chat) {
      localStorage.setItem('friendChat', JSON.stringify(chat));
      this.friendChat = chat;
    },
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    postMessage() {},
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #00a884;
}
.v-navigation-drawer__content {
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
