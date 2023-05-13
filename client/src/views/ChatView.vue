<template>
  <div style="overflow: hidden; height: 100%">
    <v-container
      fluid
      style="overflow-y: scroll; height: 100%"
      ref="container"
      v-if="currentChat.messages.length > 0"
    >
      <v-container
        class="pb-3 px-0 px-lg-5"
        v-for="(message, index) in currentChat.messages"
        :key="message.message_id"
      >
        <v-container class="text-center pt-0" v-if="index == 0">
          <v-card
            style="text-align: center; display: inline-block"
            class="mt-3 mb-0 pa-0 elevation-0 rounded-pill"
            width="200"
            color="transparent "
            ><v-card-text class="pa-0 text--disabled">{{
              getMessageDate(message.send_date)
            }}</v-card-text></v-card
          >
        </v-container>

        <div
          :style="`text-align: ${
            message.sender_id == user.user_id ? 'right' : 'left'
          } `"
        >
          <v-menu
            offset-y
            left
            max-width="120"
            :attach="`#index${message.message_id}`"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-card
                class="elevation-3 d-inline-block"
                max-width="700"
                :color="
                  message.sender_id == user.user_id
                    ? ownMessageColor.background
                    : 'white'
                "
                @mouseover="showMenu = index"
                @mouseleave="showMenu = null"
                :id="`index${message.message_id}`"
                rounded
              >
                <v-card-text
                  :class="`pb-2 pt-2 black--text  ${
                    message.sender_id == user.user_id
                      ? ownMessageColor.text
                      : 'black'
                  }--text`"
                  v-if="message.type == 'text'"
                >
                  {{ message.message }}
                </v-card-text>
                <v-img
                  v-if="message.type == 'image'"
                  max-width="250"
                  :src="message.message"
                  @click="$emit('openImage', message.message)"
                  style="cursor: pointer"
                ></v-img>

                <v-btn
                  icon
                  small
                  :large="message.type == 'image'"
                  :color="`${message.type == 'image' ? 'white' : 'black'}`"
                  :style="`
                    position: absolute;
                    top: 0;
                    right: 0;
                    background-color: ${
                      message.sender_id == user.user_id
                        ? ownMessageColor.background
                        : 'white'
                    };
                    ${message.type == 'image' ? 'background-color: none' : ''}
                    `"
                  v-show="
                    message.sender_id == user.user_id &&
                    (showMenu == index || message.type == 'image')
                  "
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </v-card>
              <div class="mr-1">
                <span
                  class="text--disabled"
                  style="font-size: 0.65rem !important"
                >
                  {{ time(message.send_date) }}
                </span>
                <span v-if="message.sender_id == user.user_id">
                  <v-icon
                    small
                    v-if="message.receiver_read"
                    color="green accent-4"
                    >mdi-check-all</v-icon
                  >
                  <v-icon small v-else>mdi-check-all</v-icon>
                </span>
              </div>
            </template>
            <v-list dense>
              <v-list-item
                @click="copyText(message.message)"
                v-if="message.type == 'text'"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon small>mdi-content-copy</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Copy</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="downloadImage(message.message)"
                v-if="message.type == 'image'"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon small>mdi-download</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Download</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="deleteText(message)">
                <v-list-item-icon class="mr-2">
                  <v-icon color="red" small>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="red--text">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-container
          class="text-center"
          v-if="
            index == -1 ||
            (currentChat.messages[index + 1] &&
              isDifferentDay(
                currentChat.messages[index].send_date,
                currentChat.messages[index + 1].send_date,
              ))
          "
        >
          <v-card
            style="text-align: center; display: inline-block"
            class="mt-3 mb-0 pa-0 elevation-0 rounded-pill"
            width="200"
            color="transparent"
            ><v-card-text class="pa-0 text--disabled">{{
              getMessageDate(currentChat.messages[index + 1].send_date)
            }}</v-card-text></v-card
          >
        </v-container>
      </v-container>
    </v-container>
    <v-container
      fluid
      style="
        overflow-y: scroll;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      ref="container"
      v-else
    >
      <div class="text-center">
        <v-icon x-large class="text--disabled" style="font-size: 100px;">mdi-message-text</v-icon>
        <h2 class="text--secondary">No chat messages yet</h2>
        <span class="text--disabled">Start the conversation!</span>
      </div>
    </v-container>

    <v-footer padless color="#f0f2f5" inset app>
      <v-btn
        color="black"
        dark
        icon
        @click="handleFileImport"
        aria-label="Choose File"
      >
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
        aria-label="Send message"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-footer>
    <v-snackbar
      v-model="showCopy"
      :timeout="2000"
      rounded="pill"
      color="grey lighten-1"
    >
      <span class="black--text">Text copied</span>

      <template v-slot:action="{ attrs }">
        <v-btn color="black" icon v-bind="attrs" @click="showCopy = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'MessageViewBody',
  props: {
    currentChat: {
      type: Object,
    },
    getMessageDate: {
      type: Function,
    },
  },
  components: {},

  created() {
    this.scrollToEnd();
    this.getUser();
  },
  data() {
    return {
      message: '',
      user: {},
      selectedFile: null,
      showFile: false,
      messageToSend: 'text',
      showCopy: false,
      showMenu: null,
      ownMessageColor: { background: '#006bff', text: 'white' },
    };
  },
  methods: {
    async deleteText(message) {
      this.$emit('deleteMessage', message);
    },
    async copyText(message) {
      await navigator.clipboard.writeText(message);

      this.showCopy = true;
    },
    downloadImage(img) {
      const downloadLink = document.createElement('a');
      downloadLink.href = img;
      let date = new Date();
      let dateName = date
        .toDateString()
        .slice(0, date.toDateString().length - 5);
      let time = `${
        date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()
      }:${
        date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
      }`;

      downloadLink.download = `ChatClique Image ${dateName} ${time}.jpeg`;
      downloadLink.click();
    },
    getUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user != null) {
        this.user = user;
      }
    },
    sendMessage() {
      let data = {
        sender: this.user,
        receiver: this.currentChat.friend[0],
        message: {
          sender_id: this.user.user_id,
          chat_id: this.currentChat.chat_id,
          send_date: new Date(),
          type: this.messageToSend,
          message: this.message,
          receiver_read: false,
        },
      };
      this.$emit('sendMessage', {
        type: 'message',
        art: this.messageToSend,
        payload: data,
      });

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
    getTime(messageDate) {
      let date = new Date(messageDate);
      return date.toDateString().slice(0, date.toDateString().length - 5);
    },

    isDifferentDay(messageD1, messageD2) {
      const d1 = new Date(messageD1);
      const d2 = new Date(messageD2);

      let sameYearMonth =
        d1.getYear() === d2.getYear() || d1.getMonth() === d2.getMonth();
      if (sameYearMonth) {
        if (d1.getDay() == d2.getDay()) return false;
        else true;
      }
      return true;
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
    scrollToEnd() {
      this.$nextTick(() => {
        const container = this.$refs.container;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    closeFileInput() {
      this.showFile = false;
      this.messageToSend = 'text';
      this.message = '';
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
