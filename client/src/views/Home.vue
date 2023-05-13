<template>
  <v-app>
    <div v-if="user.user_id">
      <v-card tile id="application">
        <v-navigation-drawer
          v-model="mini.drawer"
          :width="mini.width"
          statless
          app
          permanent
          floating
          :mini-variant.sync="closeNavigation"
        >
          <addFriend
            v-if="nav == 'addFriend'"
            @close="nav = 'chat'"
            :users="users"
            :ownUser="user"
            :requests="requests"
            :friends="friends"
            @addFriend="addFriend"
            @update="updateData"
          />

          <Profile
            v-if="nav == 'profile'"
            @close="nav = 'chat'"
            :user="user"
            @updateProfile="updateProfile"
          />
          <friendsList
            v-if="nav == 'friends'"
            @close="nav = 'chat'"
            :user="user"
            :requests="requests"
            :onlineFriends="connectedFriends"
            @setCurrentUserChat="setChatByFriend"
          />

          <createGroup
            v-if="nav == 'createGroup'"
            :friends="friends"
            @close="nav = 'chat'"
            :user="user"
          />
          <div v-if="nav == 'chat'">
            <v-list color="transparent" class="pa-3">
              <v-list-item class="mt-4 pl-1">
                <v-list-item-avatar size="50">
                  <v-img
                    width="50"
                    v-if="user.image"
                    :src="user.image"
                    @click="openImage(user.image)"
                    style="cursor: pointer"
                  ></v-img>
                  <v-img
                    v-else
                    src="@/assets/placeholder.jpg"
                    width="50"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    {{ user.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.username
                    }}<span class="text--disabled font-weight-black"
                      >#{{ user.user_id }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-menu bottom left offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" aria-label="User Menu">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list width="150" class="pt-0 pb-0 ma-1">
                    <v-list-item link @click="nav = 'createGroup'" class="pa-0">
                      <v-list-item-avatar
                        ><v-icon>mdi-account-group-outline</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title>New group</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="nav = 'profile'" class="pa-0">
                      <v-list-item-avatar
                        ><v-icon>mdi-account-edit-outline</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link dark @click="logout()" class="pa-0">
                      <v-list-item-avatar
                        ><v-icon color="red accent-4">mdi-logout</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title class="red--text text--accent-4"
                        >Log out</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  icon
                  @click.stop="closeNavigation = !closeNavigation"
                  class="hidden-sm-and-down"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>

            <v-list color="transparent" class="pa-0 ma-0 d-flex">
              <v-list-item
                link
                @click="nav = 'friends'"
                :class="`pl-6 ${
                  show == 'requests' ? 'blue-grey lighten-5' : ''
                }`"
              >
                <v-list-item-avatar size="50">
                  <v-badge
                    color="red"
                    :value="
                      requests.filter(
                        (request) => request.to_user_id == user.user_id,
                      ).length
                    "
                    :content="
                      requests.filter(
                        (request) => request.to_user_id == user.user_id,
                      ).length
                    "
                    bordered
                    overlap
                  >
                    <v-icon>mdi-account-supervisor</v-icon>
                  </v-badge>
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
                <v-icon class="ml-2 mr-3" aria-label="Search"
                  >mdi-magnify</v-icon
                >
              </template>
              <template v-slot:append-outer>
                <v-btn
                  icon
                  class="ml-2 mr-3"
                  @click="nav = 'addFriend'"
                  aria-label="Add Friends"
                  ><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn
                >
              </template>
            </v-text-field>

            <v-divider></v-divider>

            <v-list max-height="80vh" v-if="messages.length > 0">
              <v-list-item
                link
                v-for="chat in chatsWithMessages"
                :class="`pa-3 ${
                  currentUserChat.chat_id == chat.chat_id && show == 'chat'
                    ? 'blue-grey lighten-5'
                    : ''
                }`"
                :key="chat.user_id"
                @click="
                  setCurrentUserChat(chat),
                    (show = 'chat'),
                    (showFullNav = false)
                "
              >
                <span class="mr-6">
                  <v-badge
                    bottom
                    :color="
                      getStatusOfFriend(chat.friend[0])
                        ? 'green accent-4'
                        : 'transparent'
                    "
                    dot
                    offset-x="15"
                    offset-y="10"
                  >
                    <v-avatar size="50">
                      <v-img
                        width="50"
                        v-if="
                          chat.friend[0].image != null &&
                          chat.friend[0].image &&
                          chat.friend[0].image.length > 0
                        "
                        :src="chat.friend[0].image"
                      >
                      </v-img>

                      <v-img v-else src="@/assets/placeholder.jpg" width="50">
                      </v-img>
                    </v-avatar>
                  </v-badge>
                </span>
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
                <v-list-item-action class="mr-4">
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
                    .length > 0 && !closeNavigation
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
              <v-divider v-show="closeNavigation"></v-divider>
              <v-list-item
                link
                v-for="chat in searchChats.filter(
                  (chat) => chat.messages.length == 0,
                )"
                :class="`pa-3 ${
                  currentUserChat.chat_id == chat.chat_id && show == 'chat'
                    ? 'blue-grey lighten-5'
                    : ''
                }`"
                :key="chat.user_id"
                @click="
                  setCurrentUserChat(chat),
                    (show = 'chat'),
                    (showFullNav = false)
                "
              >
                <span class="mr-6">
                  <v-badge
                    bottom
                    :color="
                      getStatusOfFriend(chat.friend[0])
                        ? 'green accent-4'
                        : 'transparent'
                    "
                    dot
                    offset-x="15"
                    offset-y="10"
                  >
                    <v-avatar>
                      <v-img
                        width="50"
                        v-if="
                          chat.friend[0].image != null &&
                          chat.friend[0].image &&
                          chat.friend[0].image.length > 0
                        "
                        :src="chat.friend[0].image"
                      ></v-img>

                      <v-img
                        width="50"
                        v-else
                        src="@/assets/placeholder.jpg"
                        style="cursor: pointer"
                      ></v-img>
                    </v-avatar>
                  </v-badge>
                </span>

                <v-list-item-content>
                  <v-list-item-title>{{
                    chat.friend[0].username
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-navigation-drawer>
        <div v-if="show == 'chat' && currentUserChat.friend">
          <v-app-bar
            color="transparent"
            class="pa-3"
            height="100"
            elevation="0"
            app
            rounded="0"
          >
            <v-app-bar-nav-icon
              class="hidden-sm-and-up"
              @click="showFullNav = true"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-app-bar-nav-icon>

            <v-list color="transparent" class="pa-3 ml-0 pl-0">
              <v-list-item
                inactive
                style="cursor: pointer"
                @click="openFriendInfo(currentUserChat.friend[0])"
              >
                <v-list-item-avatar size="50">
                  <v-img
                    width="50"
                    v-if="
                      currentUserChat.friend[0].image != null &&
                      currentUserChat.friend[0].image &&
                      currentUserChat.friend[0].image.length > 0
                    "
                    :src="currentUserChat.friend[0].image"
                  ></v-img>

                  <v-img
                    width="50"
                    v-else
                    src="@/assets/placeholder.jpg"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h7 three-line">
                    {{
                      Object.keys(currentUserChat).length > 0
                        ? currentUserChat.friend[0].username
                        : ''
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="">
                    <v-icon
                      :color="
                        getStatusOfFriend(currentUserChat.friend[0])
                          ? 'green accent-4'
                          : 'red'
                      "
                      >mdi-circle-medium</v-icon
                    >
                    {{
                      getStatusOfFriend(currentUserChat.friend[0])
                        ? 'online'
                        : 'offline'
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-spacer></v-spacer>
            <v-btn icon @click="callFriend(currentUserChat.friend[0])">
              <v-icon>mdi-video-outline</v-icon>
            </v-btn>
          </v-app-bar>

          <v-main hide-overlay style="height: 100vh" class="grey lighten-4">
            <ChatView
              @sendMessage="sendMessage"
              :currentChat="currentChat"
              @openImage="openImage"
              :getMessageDate="getMessageDate"
              ref="chat"
              @deleteMessage="deleteMessage"
            />
          </v-main>
        </div>

        <div v-if="!currentUserChat.friend">
          <v-main><Start /></v-main>
        </div>
      </v-card>
    </div>

    <!-- <div v-else>
          <v-main><Login /></v-main>
        </div> -->
    <v-dialog
      v-model="image"
      max-height="700"
      max-width="800"
      content-class="elevation-0"
    >
      <openImage :image="imageToOpen" @close="image = false" />
    </v-dialog>
    <v-navigation-drawer
      statless
      app
      permanent
      right
      v-if="showFriendInfo"
      width="500"
    >
      <friendInfo
        :friendInfo="friendInfo"
        @close="showFriendInfo = false"
        @openImage="openImage"
      />
    </v-navigation-drawer>
    <v-dialog
      v-model="showCalling"
      max-height="700"
      max-width="800"
      content-class="elevation-0"
    >
      <calling @close="showCalling = false" />
    </v-dialog>

    <v-dialog
      v-model="call"
      max-height="700"
      max-width="800"
      content-class="elevation-0"
    >
      <v-card>Calllling</v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { ref } from 'vue';
// import Login from '@/views/Login.vue';
import Start from '@/views/Start.vue';
import Profile from '@/views/Profile.vue';
import addFriend from '@/views/addFriend.vue';
import friendsList from '@/views/friendsList.vue';
import openImage from '@/components/openImage.vue';
import calling from '@/components/calling.vue';
import friendInfo from '@/components/friendInfo.vue';
import ChatView from '@/views/ChatView.vue';
import createGroup from '@/views/createGroup.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    // Login,
    Start,
    addFriend,
    friendsList,
    openImage,
    Profile,
    ChatView,
    friendInfo,
    calling,
    createGroup,
  },
  data: () => ({
    ws: null,
    search: '',
    currentUserChat: {},
    user: {},
    addFriendDialog: false,
    messages: [],
    users: [],
    connectedFriends: [],
    show: '',
    nav: 'chat',
    image: false,
    imageToOpen: null,
    server: process.env.VUE_APP_SERVER,
    protocol: process.env.VUE_APP_WS_PROTOCOL,
    showChat: false,
    showFullNav: false,
    requests: [],
    chatRef: null,
    friends: [],
    showFriendInfo: false,
    friendInfo: {},
    showCalling: false,
    call: false,
    closeNavigation: false,
  }),
  setup() {
    const childRef = ref(null);

    const triggerChildMethod = () => {
      childRef.value.childMethod();
    };

    return {
      childRef,
      triggerChildMethod,
    };
  },

  async created() {
    this.getUser();
    if (this.user.user_id != null) {
      this.createWSConnection();
      this.WebSocketMessages();
      // let currentUserChat = JSON.parse(localStorage.getItem('currentUserChat'));
      // if (currentUserChat) {
      //   this.setCurrentUserChat(currentUserChat, 'fromStorage');
      //   this.show = 'chat';
      // }
      await this.getUsers();
      await this.getRequests();
      await this.getFriends();
    }
  },
  computed: {
    chatsWithMessages() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.searchChats
        .filter((chat) => chat.messages.length > 0)
        .sort((a, b) => {
          const lastMessageA = a.messages[a.messages.length - 1];
          const lastMessageB = b.messages[b.messages.length - 1];
          if (lastMessageA && lastMessageB) {
            return (
              new Date(lastMessageB.send_date) -
              new Date(lastMessageA.send_date)
            );
          }
        });
    },
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

    mini() {
      if (!this.currentUserChat.friend && this.$vuetify.breakpoint.name == 'xs')
        return { width: '100vw', drawer: false };
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return { width: this.showFullNav ? '100vw' : '0', drawer: false };
        case 'sm':
          return { width: '250', drawer: true };
        case 'md':
          return { width: '500', drawer: true };
        case 'lg':
          return { width: '500', drawer: true };
        case 'xl':
          return { width: '500', drawer: true };
        default:
          return false;
      }
    },
  },
  methods: {
    setChatByFriend(friend) {
      let chatofFriend = this.messages.find(
        (chat) => chat.friend[0].user_id == friend.user_id,
      );
      this.setCurrentUserChat(chatofFriend);
    },
    async updateProfile(body) {
      const { data } = await axios({
        url: '/user/' + this.user.user_id,
        method: 'PATCH',
        data: {
          image: body.image,
          name: body.name,
        },
      });
      localStorage.setItem('user', JSON.stringify(data));
      this.getUser();
    },
    async getFriends() {
      const { data } = await axios({
        url: '/friends/' + this.user.user_id,
        method: 'GET',
      });
      this.friends = data;
    },
    getStatusOfFriend(friend) {
      if (this.connectedFriends.find((user) => user.user_id == friend.user_id))
        return true;
      else return false;
    },
    callFriend(f) {
      let friend = this.friends.find((friend) => friend.user_id == f.user_id);
      this.ws.send(
        JSON.stringify({
          type: 'calling',
          payload: {
            caller: this.user,
            friend: friend,
          },
        }),
      );
    },
    openImage(img) {
      this.image = true;
      this.imageToOpen = img;
    },
    openFriendInfo(friend) {
      this.friendInfo = this.friends.find((f) => friend.user_id == f.user_id);
      this.showFriendInfo = true;
    },
    sendMessage(data) {
      this.ws.send(JSON.stringify(data));
    },
    deleteMessage(data) {
      let message = this.messages.filter((chat) =>
        chat.messages.find((message) => message.message_id == data.message_id),
      );
      this.ws.send(
        JSON.stringify({
          type: 'delete',
          payload: {
            message_id: data.message_id,
            chat: message[0].chat_id,
            user_id: this.user.user_id,
            friend_id: message[0].friend[0].user_id,
          },
        }),
      );
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
            this.connectedFriends = userdata.payload;
            break;
          case 'disconnected':
            this.connectedFriends = this.connectedFriends.filter(
              (user) => user.user_id != userdata.payload.user_id,
            );
            break;
          case 'getting call':
            this.call = true;
            break;
          case 'calling':
            this.showCalling = true;
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
            this.messages
              .filter((chats) => chats.chat_id == userdata.payload.chat_id)[0]
              .messages.find(
                (chat) => chat.message_id == userdata.payload.message_id,
              ).receiver_read = true;

            break;
          case 'deleted':
            this.messages = this.messages.map((chat) => {
              chat.messages = chat.messages.filter(
                (message) => message.message_id !== userdata.payload.message_id,
              );
              return chat;
            });
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
        url: '/users',
        method: 'GET',
      });
      this.users = data;
    },
    async logout() {
      await axios({
        url: '/logout',
        method: 'GET',
      });
      localStorage.clear();
      this.$router.push('/login');
      //   this.$router.go();
    },
    async addFriend(friend) {
      await axios({
        url: '/request',
        method: 'POST',
        data: {
          from_user_id: this.user.user_id,
          to_user_id: friend.user_id,
          requested_date: new Date(),
          status: 'requested',
        },
      });
      this.getRequests();
    },
    async getRequests() {
      const { data } = await axios({
        url: '/requests/' + this.user.user_id,
      });
      this.requests = data;
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
    async setCurrentUserChat(chat) {
      this.show = 'chat';
      this.scrollToEnd();
      // if (type == 'toStorage')
      //   localStorage.setItem('currentUserChat', JSON.stringify(chat));
      this.currentUserChat = chat;
      if (this.messages.length > 0) {
        let unreadMessages = this.messages
          .filter((chats) => chats.chat_id == chat.chat_id)[0]
          .messages.filter(
            (chat) =>
              chat.receiver_read == false &&
              chat.sender_id != this.user.user_id,
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
            url: '/messages/' + chat.chat_id,
            method: 'PATCH',
          });
        }
      }
    },
    async updateData() {
      await this.getRequests();
    },
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    scrollToEnd() {
      this.$nextTick(() => {
        const chat = this.$refs.chat;
        if (chat) chat.scrollToEnd();
      });
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
