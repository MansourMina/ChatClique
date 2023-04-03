<template>
  <v-container fluid max-height="100vh" style="overflow-y: hidden">
    <v-timeline color="green">
      <Chat :friendChat="friendChat" />
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
import Chat from '@/components/Chat.vue';
export default {
  name: 'MessageViewBody',
  props: {
    chats: {
      type: Array,
    },
    friendChat: {
      type: Object,
    },
  },
  data() {
    return {
      message: '',
    };
  },
  components: {
    Chat,
  },
  methods: {
    async sendMessage() {
      this.$emit('sendMessage', {
        friendChat: this.friendChat,
        text: this.message,
      });
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
