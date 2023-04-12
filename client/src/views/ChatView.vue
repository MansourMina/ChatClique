<template>
  <div style="overflow: hidden; height: 100%" ref="container">
    <v-container fluid style="overflow-y: scroll; height: 100%" class="mb-0 pb-0">
      <v-timeline color="green" class="mb-0 pb-0" v-if="currentChat">
        <v-timeline-item
          v-for="message in currentChat.messages"
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
            <v-card-text
              class="pt-2 black--text mb-0 pb-0"
              v-if="message.type == 'text'"
            >
              {{ message.message }}
            </v-card-text>
            <v-img
              v-if="message.type == 'image'"
              :src="message.message"
            ></v-img>
            <span
              class="text-caption grey--text text--darken-1 float-right mr-2"
              style="font-size: 0.65rem !important"
            >
              {{ time(message.send_date) }}
            </span>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
    <v-footer padless color="#f0f2f5" inset app>
      <v-btn color="black" dark icon @click="handleFileImport">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>

      <!-- hidden but triggered with JavaScript -->
      <input
        ref="uploader"
        class="d-none"
        type="file"
        @input="onFileChanged"
        accept="image/png, image/jpeg"
      />
      <v-file-input
        v-if="showFile"
        class="pa-2"
        solo
        hide-details
        flat
        rounded
        truncate-length="15"
        v-model="selectedFile"
        append-icon="mdi-close"
        :clearable="false"
        prepend-icon=""
        @click:append="closeFileInput()"
        @keyup.enter="message.length > 0 ? sendMessage() : false"
      ></v-file-input>
      <v-text-field
        v-else
        class="pa-2"
        label="send a message"
        solo
        hide-details
        flat
        rounded
        v-model="message"
        @keyup.enter="message.length > 0 ? sendMessage() : false"
      ></v-text-field>
      <v-btn
        color="black"
        dark
        icon
        @click="message.length > 0 ? sendMessage() : false"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-footer>
  </div>
</template>
<script>
export default {
  name: 'MessageViewBody',
  props: {
    friendChat: {
      type: Object,
    },
    currentChat: {
      type: Object,
    },
  },

  created() {
    this.getUser();
  },
  data() {
    return {
      message: '',
      user: {},
      selectedFile: null,
      showFile: false,
      messageToSend: 'text',
      showMenu: false,
      x: 0,
      y: 0,
    };
  },

  methods: {
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    sendMessage() {
      let data = {
        sender: this.user,
        receiver: this.friendChat.friend[0],
        message: {
          user_id: this.user.user_id,
          chat_id: this.friendChat.chat_id,
          send_date: new Date(),
          type: this.messageToSend,
          message: this.message,
        },
      };
      this.$emit('sendMessage', {
        type: 'message',
        art: this.messageToSend,
        payload: data,
      });
      this.scrollToEnd();

      this.message = '';
      this.messageToSend = 'text';
      this.showFile = false;
    },
    time(time) {
      let convTime = new Date(time);
      let timeOfMessage = `${
        convTime.getHours() <= 9
          ? '0' + convTime.getHours()
          : convTime.getHours()
      }:${
        convTime.getMinutes() <= 9
          ? '0' + convTime.getMinutes()
          : convTime.getMinutes()
      }`;
      return timeOfMessage;
    },
    scrollToEnd() {
      const container = this.$refs['container'];
      this.$nextTick(() => (container.scrollTop = container.scrollHeight));
    },
    handleFileImport() {
      this.showFile = true;
      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      this.messageToSend = 'image';

      await this.getBase64(this.selectedFile).then((data) => {
        this.message = data;
      });
    },
    closeFileInput() {
      this.showFile = false;
      this.messageToSend = 'text';
      this.message = '';
    },
    getSizeOfImage(img) {
      return { width: img.width, height: img.height };
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        return Promise.resolve(reader.result);
      });
    },
  },
};
</script>

<style>
.triangle.right-top:before {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -20px;
  top: 0;
  bottom: auto;
  border: 32px solid;
  border-color: blue transparent transparent transparent;
}
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item:nth-child(even):not(.v-timeline-item--after)
  .v-timeline-item__body
  > .v-card:not(.v-card--link)::before,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item:nth-child(even):not(.v-timeline-item--after)
  .v-timeline-item__body
  > .v-card::after,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item--before
  .v-timeline-item__body
  > .v-card:not(.v-card--link)::before,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item--before
  .v-timeline-item__body
  > .v-card::after {
  display: none;
}

.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item:nth-child(odd):not(.v-timeline-item--before)
  .v-timeline-item__body
  > .v-card:not(.v-card--link)::before,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item:nth-child(odd):not(.v-timeline-item--before)
  .v-timeline-item__body
  > .v-card::after,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item--after
  .v-timeline-item__body
  > .v-card:not(.v-card--link)::before,
.v-application--is-ltr
  .v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
  .v-timeline-item--after
  .v-timeline-item__body
  > .v-card::after {
  display: none;
}
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
.image-upload > input {
  display: none;
}

.image-upload img {
  width: 80px;
  cursor: pointer;
}
</style>
