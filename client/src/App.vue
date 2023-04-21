<template>
  <v-app>
    <div v-if="user.user_id">
      <v-card tile id="application">
        <v-navigation-drawer width="500" statless app>
          <div v-if="!addFriendDialog">
            <v-app-bar
              color="#00a884"
              height="100"
              elevation="0"
              rounded="0"
              class="mb-0"
            >
              <v-list color="transparent" class="pa-3 ml-0 pl-0">
                <v-list-item class="mt-4 pl-1">
                  <v-list-item-avatar size="50">
                    <v-img v-if="user.image" :src="user.image"></v-img>
                    <v-img v-else src="@/assets/placeholder.jpg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 white--text">
                      {{ user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text">
                      {{ user.username
                      }}<span class="text--disabled font-weight-black"
                        >#{{ user.user_id }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-spacer></v-spacer>
              <div class="mt-6">
                <v-menu bottom left offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item link @click="logout()">
                      <v-list-item-title>Abmelden</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-app-bar>

            <v-list color="transparent" class="pa-0 ma-0">
              <v-list-item
                link
                @click="show = 'requests'"
                :class="`pl-2 ${
                  show == 'requests' ? 'blue-grey lighten-5' : ''
                }`"
              >
                <v-list-item-avatar size="50">
                  <v-btn icon>
                    <v-icon>mdi-account-supervisor</v-icon>
                  </v-btn>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title> Friends </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-text-field
              placeholder="Find or start a conversation"
              class="pa-4 pt-0"
              hide-details
              clearable
              v-model="search"
            >
              <template v-slot:prepend>
                <v-icon class="ml-2 mr-3">mdi-magnify</v-icon>
              </template>
              <template v-slot:append-outer>
                <v-btn icon class="ml-2 mr-3" @click="addFriendDialog = true"
                  ><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn
                >
              </template>
            </v-text-field>

            <v-divider></v-divider>

            <v-list
              three-line
              class="mt-0 pt-0 mb-10"
              style="overflow-y: scroll"
              max-height="80vh"
              v-if="messages.length > 0"
            >
              <v-list-item
                link
                v-for="chat in searchChats.filter(
                  (chat) => chat.messages.length > 0,
                )"
                :class="`pl-4 pr-3 ${
                  currentUserChat.chat_id == chat.chat_id && show == 'chat'
                    ? 'blue-grey lighten-5'
                    : ''
                }`"
                :key="chat.user_id"
                @click="setCurrentUserChat(chat, 'toStorage'), (show = 'chat')"
              >
                <v-list-item-avatar class="mt-6">
                  <v-img
                    v-if="
                      chat.friend[0].image != null &&
                      chat.friend[0].image &&
                      chat.friend[0].image.length > 0
                    "
                    :src="chat.friend[0].image"
                    @click="openImage(chat.friend[0].image)"
                    style="cursor: pointer"
                  ></v-img>

                  <v-img v-else src="@/assets/placeholder.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{
                    chat.friend[0].username
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                      v-if="
                        chat.messages[chat.messages.length - 1].sender_id ==
                        user.user_id
                      "
                    >
                      <v-icon
                        small
                        v-if="
                          chat.messages[chat.messages.length - 1].receiver_read
                        "
                        color="green accent-4"
                        >mdi-check-all</v-icon
                      >
                      <v-icon small v-else>mdi-check-all</v-icon>
                      <span class="font-weight-bold">
                        {{ 'You:' }}
                      </span>
                    </span>

                    <v-icon
                      v-if="
                        chat.messages[chat.messages.length - 1].type == 'image'
                      "
                      small
                      >mdi-camera</v-icon
                    >
                    {{ lastMessage(chat) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <p>
                    <v-list-item-action-text
                      :class="`${chat.unread > 0 ? 'green' : ''}--text`"
                    >
                      {{
                        getMessageDate(
                          chat.messages[chat.messages.length - 1].send_date,
                          'chat',
                        )
                      }}</v-list-item-action-text
                    >
                  </p>

                  <v-badge
                    color="green"
                    class="mr-3 ml-5 mt-3"
                    v-if="getUnread(chat) > 0"
                  >
                    <span slot="badge">{{ getUnread(chat) }}</span>
                  </v-badge>
                </v-list-item-action>
              </v-list-item>
              <v-row
                wrap
                no-gutters
                class="ma-3"
                v-if="
                  searchChats.filter((chat) => chat.messages.length == 0)
                    .length > 0
                "
              >
                <v-col cols="4" class="text-center mt-3">
                  <v-divider />
                </v-col>
                <v-col cols="4" class="text-center"> start new chat </v-col>
                <v-col cols="4" class="text-center mt-3">
                  <v-divider />
                </v-col>
              </v-row>
              <v-list-item
                link
                v-for="chat in searchChats.filter(
                  (chat) => chat.messages.length == 0,
                )"
                :class="`pl-4 pr-3 ${
                  currentUserChat.chat_id == chat.chat_id && show == 'chat'
                    ? 'blue-grey lighten-5'
                    : ''
                }`"
                :key="chat.user_id"
                @click="setCurrentUserChat(chat, 'toStorage'), (show = 'chat')"
              >
                <v-list-item-avatar class="mt-6">
                  <v-img
                    v-if="
                      chat.friend[0].image != null &&
                      chat.friend[0].image &&
                      chat.friend[0].image.length > 0
                    "
                    :src="chat.friend[0].image"
                    @click="openImage(chat.friend[0].image)"
                    style="cursor: pointer"
                  ></v-img>

                  <v-img
                    v-else
                    src="@/assets/placeholder.jpg"
                    style="cursor: pointer"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{
                    chat.friend[0].username
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <addFriend
            v-else
            @close="addFriendDialog = false"
            :users="users"
            :ownUser="user"
            @addFriend="addFriend"
          />
        </v-navigation-drawer>

        <div v-if="show == 'requests'">
          <v-main> <friendsList :user="user" /></v-main>
        </div>
        <div v-if="show == 'chat' && currentUserChat.friend">
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
                  v-if="
                    currentUserChat.friend[0].image != null &&
                    currentUserChat.friend[0].image &&
                    currentUserChat.friend[0].image.length > 0
                  "
                  :src="currentUserChat.friend[0].image"
                  @click="openImage(currentUserChat.friend[0].image)"
                  style="cursor: pointer"
                ></v-img>

                <v-img v-else src="@/assets/placeholder.jpg"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-h6 white--text">
                  {{
                    Object.keys(currentUserChat).length > 0
                      ? currentUserChat.friend[0].username
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

          <v-main hide-overlay style="height: 100vh">
            <router-view
              @sendMessage="sendMessage"
              :currentChat="currentChat"
              @openImage="openImage"
              :getMessageDate="getMessageDate"
              ref="container"
            />
          </v-main>
        </div>
        <div v-if="!currentUserChat.friend">
          <v-main><Home /></v-main>
        </div>
      </v-card>
    </div>

    <div v-else>
      <v-main><Login /></v-main>
    </div>
    <v-dialog
      v-model="image"
      max-height="700"
      max-width="800"
      content-class="elevation-0"
    >
      <openImage :image="imageToOpen" @close="image = false" />
    </v-dialog>
  </v-app>
</template>

<script>
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import addFriend from '@/components/addFriend.vue';
import friendsList from '@/components/friendsList.vue';
import openImage from '@/components/openImage.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Login,
    Home,
    addFriend,
    friendsList,
    openImage,
  },
  data: () => ({
    ws: null,
    search: '',
    currentUserChat: {},
    user: {},
    addFriendDialog: false,
    messages: [],
    users: [],
    show: '',
    image: false,
    imageToOpen: null,
    server: process.env.VUE_APP_SERVER,
    protocol: process.env.VUE_APP_WS_PROTOCOL,
  }),
  async created() {
    this.getUser();
    if (this.user.user_id != null) {
      this.createWSConnection();
      this.WebSocketMessages();
      let currentUserChat = JSON.parse(localStorage.getItem('currentUserChat'));
      if (currentUserChat) {
        this.setCurrentUserChat(currentUserChat, 'fromStorage');
        this.show = 'chat';
      }
      await this.getUsers();
    }
  },
  computed: {
    searchChats() {
      return this.messages.filter((el) =>
        el.friend[0].username.includes(this.search),
      );
    },
    currentChat() {
      return this.messages.filter(
        (el) => el.chat_id == this.currentUserChat.chat_id,
      )[0];
    },
  },
  methods: {
    openImage(img) {
      this.image = true;
      this.imageToOpen = img;
    },
    sendMessage(data) {
      this.ws.send(JSON.stringify(data));
    },
    getUnread(chat) {
      return this.messages
        .filter((el) => el.chat_id == chat.chat_id)[0]
        .messages.filter(
          (el) =>
            el.sender_id != this.user.user_id && el.receiver_read == false,
        ).length;
    },
    read(data) {
      this.ws.send(
        JSON.stringify({
          type: 'read',
          payload: data,
        }),
      );
    },
    WebSocketMessages() {
      this.ws.onmessage = async ({ data }) => {
        var userdata = JSON.parse(data);

        switch (userdata.type) {
          case 'connected':
            break;
          case 'disconnected':
            break;
          case 'text':
            if (
              userdata.payload.message.chat_id ==
                this.currentUserChat.chat_id &&
              userdata.payload.message.sender_id != this.user.user_id
            ) {
              this.read(userdata.payload.message);
              userdata.payload.message.receiver_read = true;
            } else userdata.payload.message.receiver_read = false;

            this.messages
              .filter((el) => el.chat_id == userdata.payload.message.chat_id)[0]
              .messages.push(userdata.payload.message);
            this.scrollToEnd();
            break;

          case 'loadMessages':
            this.messages = userdata.payload;
            break;
          case 'readMessage':
            // eslint-disable-next-line no-case-declarations
            console.log('geht rein');
            this.messages
              .filter((chats) => chats.chat_id == userdata.payload.chat_id)[0]
              .messages.find(
                (chat) => chat.message_id == userdata.payload.message_id,
              ).receiver_read = true;

            break;
        }
      };
    },
    createWSConnection() {
      this.ws = new WebSocket(
        this.server
          ? `${this.protocol}://${this.server}`
          : `${this.protocol}://${location.host}`,
      );
      this.ws.onopen = () => {
        this.ws.send(
          JSON.stringify({
            type: 'connected',
            payload: { user: this.user },
          }),
        );
      };
    },
    async getUsers() {
      const { data } = await axios({
        url: 'http://localhost:3000/users',
      });
      this.users = data;
    },
    async logout() {
      await axios({
        url: 'http://localhost:3000/logout',
        method: 'GET',
      });
      localStorage.clear();
      this.$router.push('/');
      this.$router.go();
    },
    async addFriend(friend) {
      await axios({
        url: 'http://localhost:3000/request',
        method: 'POST',
        data: {
          from_user_id: this.user.user_id,
          to_user_id: friend.user_id,
          requested_date: new Date(),
          status: 'requested',
        },
      });
    },
    getMessageDate(time, type) {
      let today = new Date();
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const messageTime = new Date(time);

      if (messageTime.getFullYear() === today.getFullYear()) {
        if (messageTime.getDay() === today.getDay()) {
          return type == 'chat'
            ? `${
                messageTime.getHours() <= 9
                  ? '0' + messageTime.getHours()
                  : messageTime.getHours()
              }:${
                messageTime.getMinutes() <= 9
                  ? '0' + messageTime.getMinutes()
                  : messageTime.getMinutes()
              }`
            : 'Today';
        } else if (messageTime.getDay() === yesterday.getDay()) {
          return 'Yesterday';
        } else {
          return messageTime
            .toDateString()
            .slice(0, messageTime.toDateString().length - 5);
        }
      } else {
        return messageTime.toDateString();
      }
    },
    lastMessage(chat) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return lastMessage.type == 'text' ? lastMessage.message : 'Photo';
    },
    async setCurrentUserChat(chat, type) {
      if (type == 'toStorage')
        localStorage.setItem('currentUserChat', JSON.stringify(chat));
      this.currentUserChat = chat;

      let unreadMessages = this.messages
        .filter((chats) => chats.chat_id == chat.chat_id)[0]
        .messages.filter(
          (chat) =>
            chat.receiver_read == false && chat.sender_id != this.user.user_id,
        );
      if (unreadMessages.length > 0) {
        unreadMessages.forEach((message) => (message.receiver_read = true));
        // this.ws.send(
        //   JSON.stringify({
        //     type: 'read',
        //     payload: unreadMessages,
        //   }),
        // );
        await axios({
          url: 'http://localhost:3000/messages/' + chat.chat_id,
          method: 'PATCH',
        });
      }
      // window.scrollTo(0, 0);
    },
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    scrollToEnd() {
      const container = this.$refs['container'];
      if (container)
        (container.scrollTop = 0), console.log(container.scrollHeight);
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

#application {
  background: url('./assets/background.png') center fixed !important;
  background-size: cover;
}
</style>
