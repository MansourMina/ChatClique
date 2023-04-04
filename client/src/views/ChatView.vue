<template>
  <v-container fluid style="overflow-y: scroll; height: 89vh">
    <v-timeline color="green" class="pb-6">
      <div>
        <v-timeline-item
          v-for="message in messages"
          :key="message.message.message_id"
          color="red lighten-2"
          hide-dot
          icon="mdi-magnify"
          :left="message.user_id != user.user_id"
          :right="message.user_id == user.user_id"
        >
          <v-card
            class="elevation-3 d-inline-block"
            max-width="100%"
            min-width="50%"
            :color="message.user_id == user.user_id ? '#d9fdd3' : 'white'"
            :style="`text-align: ${
              message.user_id == user.user_id ? 'right' : 'left'
            } `"
          >
            <!-- <v-card-text
          :class="`pb-0 pt-2 ${randomColorPicker()}--text`"
          v-if="!message.ownMessage"
        >
          {{ message.user_id }}
        </v-card-text> -->
            <v-card-text class="pt-2 pb-2">
              {{ message.text }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </div>
    </v-timeline>
    <v-footer padless absolute color="transparent">
      <!-- <v-col class="text-center mt-0 pt-0" cols="12"> -->
      <v-text-field
        label="send a message"
        solo
        hide-details
        v-model="message"
        @keyup.enter="sendMessage()"
      ></v-text-field>
      <!-- </v-col> -->
    </v-footer>
  </v-container>
</template>
<script>
export default {
  name: 'MessageViewBody',
  props: {
    chats: {
      type: Array,
    },
    // friendChat: {
    //   type: Object,
    // },
  },
  created() {
    this.getUser();
    const server = process.env.VUE_APP_SERVER;
    const protocol = process.env.VUE_APP_WS_PROTOCOL;
    this.ws = new WebSocket(
      server ? `${protocol}://${server}` : `${protocol}://${location.host}`,
    );
    let friendChat = JSON.parse(localStorage.getItem('friendChat'));
    if (friendChat != null) {
      this.friendChat = friendChat;
    }
    this.messages = this.friendChat.messages;
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          type: 'connected',
          payload: { user: this.user },
        }),
      );
    };
    this.ws.onmessage = ({ data }) => {
      var message = JSON.parse(data);

      switch (message.type) {
        case 'text':
          // eslint-disable-next-line vue/no-mutating-props
          // this.$emit('addToChat', {
          //   friendChat: this.friendChat,
          //   message: message.payload.message,
          // }));

          this.messages.push(message.payload);
      }
    };
  },
  data() {
    return {
      message: '',
      ws: null,
      messages: [],
      user: {},
      friendChat: {},
    };
  },

  methods: {
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    async sendMessage() {
      this.ws.send(
        JSON.stringify({
          type: 'message',
          payload: {
            sender: this.user,
            receiver: this.friendChat.friend[0],
            message: {
              user_id: this.user.user_id,
              chat_id: this.friendChat.chat_id,
              send_date: new Date(),
              text: this.message,
            },
          },
        }),
      );
      this.message = '';
    },
  },
};
</script>

<style>
.v-timeline::before {
  bottom: 0;
  content: '';
  height: 100%;
  position: absolute;
  top: 0;
  width: 2px;
  display: none;
}
#button-input {
  position: fixed;
}
</style>
