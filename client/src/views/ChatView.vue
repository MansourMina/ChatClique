<template>
  <v-container fluid style="overflow-y: scroll; height: 89vh" ref="container">
    <v-timeline color="green" class="pb-6" v-if="messages.length > 0">
      <div>
        <v-timeline-item
          v-for="message in messages.filter(
            (el) => el.chat_id == friendChat.chat_id,
          )[0].messages"
          :key="message.message_id"
          color="red lighten-2"
          hide-dot
          :left="message.user_id != user.user_id"
          :right="message.user_id == user.user_id"
          :style="`text-align: ${
            message.user_id == user.user_id ? 'right' : 'left'
          } `"
          ref="chat"
        >
          <v-card
            class="elevation-3 d-inline-block"
            max-width="100%"
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
              {{ message.message }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </div>
    </v-timeline>
    <v-footer padless absolute color="transparent">
      <v-text-field
        label="send a message"
        solo
        hide-details
        v-model="message"
        @keyup.enter="sendMessage()"
      ></v-text-field>
    </v-footer>
  </v-container>
</template>
<script>
export default {
  name: 'MessageViewBody',
  props: {
    friendChat: {
      type: Object,
    },
  },

  created() {
    this.getUser();

    const server = process.env.VUE_APP_SERVER;
    const protocol = process.env.VUE_APP_WS_PROTOCOL;
    this.ws = new WebSocket(
      server ? `${protocol}://${server}` : `${protocol}://${location.host}`,
    );

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
          this.messages
            .filter((el) => el.chat_id == this.friendChat.chat_id)[0]
            .messages.push(message.payload.message);
          this.scrollToEnd();

          break;
        case 'loadMessages':
          this.messages = message.payload;
      }
    };
  },
  data() {
    return {
      message: '',
      ws: null,
      messages: [],
      user: {},
    };
  },

  methods: {
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
      // console.log(this.messages)
      // return this.messages.filter(
      //   (el) => el.chat_id == this.friendChat.chat_id,
      // )[0].messages;
    },
    sendMessage() {
      let data = {
        sender: this.user,
        receiver: this.friendChat.friend[0],
        message: {
          user_id: this.user.user_id,
          chat_id: this.friendChat.chat_id,
          send_date: new Date(),
          message: this.message,
        },
      };
      this.ws.send(
        JSON.stringify({
          type: 'message',
          payload: data,
        }),
      );
      this.message = '';
      this.scrollToEnd();

      // this.$refs.chat[this.messages.length - 1].focus;
    },
    scrollToEnd() {
      const container = this.$refs['container'];
      this.$nextTick(() => (container.scrollTop = container.scrollHeight));
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
