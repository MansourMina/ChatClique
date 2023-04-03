<template>
  <v-app>
    <v-card style="background-color: #f4f1eb" tile>
      <v-navigation-drawer width="25%" statless app>
        <v-list color="#00a884" class="pa-3" height="10.6vh">
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
                Mina Mansour
              </v-list-item-title>
              <v-list-item-subtitle class="white--text"
                >mansourmina10@gmail.com</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>

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
        <v-container fluid style="overflow-y: scroll"
          ><router-view
            :chats="chats"
            :friendChat="friendChat"
            @sendMessage="postMessage"
        /></v-container>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',

  data: () => ({
    search: '',
    chats: [],
    user_id: '4593822',
    friendChat: {},
  }),
  async created() {
    await this.getChats();
    let friendChat = JSON.parse(localStorage.getItem('friendChat'));
    if (friendChat) this.friendChat = friendChat;
  },
  methods: {
    async getChats() {
      const { data } = await axios({
        url: `http://localhost:3000/chats/${this.user_id}`,
        method: 'GET',
      });
      this.chats = data;
    },
    setFriendChat(chat) {
      localStorage.setItem('friendChat', JSON.stringify(chat));
      this.friendChat = chat;
    },
    async postMessage(data) {
      console.log(data);
      try {
        await axios({
          url: 'http://localhost:3000/messages',
          method: 'POST',
          contentType: 'application/json',
          data: {
            text: data.text,
            send_date: new Date(),
            user_id: this.user_id,
            chat_id: data.friendChat.chat_id,
          },
        });
        this.getChats();
      } catch (err) {
        console.log(err.response.data);
      }
    },
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
