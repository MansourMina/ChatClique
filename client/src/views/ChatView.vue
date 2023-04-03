<template>
  <v-container fluid max-height="100vh" style="overflow-y: hidden">
    <v-timeline color="green">
      <Chat :friendChat="friendChat" />
    </v-timeline>
    <v-footer padless absolute color="transparent">
      <!-- <v-col class="text-center mt-0 pt-0" cols="12"> -->
      <v-text-field
        value="John Doe"
        label="Solo"
        solo
        hide-details
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
  components: {
    Chat,
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
