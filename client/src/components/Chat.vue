<template>
  <div style="height: 81vh">
    <v-timeline-item
      v-for="message in friendChat.messages"
      :key="message.message_id"
      color="red lighten-2"
      hide-dot
      icon="mdi-magnify"
      :left="!message.ownMessage"
      :right="message.ownMessage"
    >
      <v-card
        class="elevation-3 d-inline-block"
        max-width="100%"
        min-width="50%"
        :color="message.ownMessage ? '#d9fdd3' : 'white'"
        :style="`text-align: ${message.ownMessage ? 'right' : 'left'} `"
      >
        <!-- <v-card-text
          :class="`pb-0 pt-2 ${randomColorPicker()}--text`"
          v-if="!message.ownMessage"
        >
          {{ message.user_id }}
        </v-card-text> -->
        <v-card-text class="pt-2 pb-2"> {{ message.message }} </v-card-text>
      </v-card>
    </v-timeline-item>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: {
    friendChat: {
      type: Object,
    },
  },
  methods: {
    randomColorPicker() {
      let colors = ['red', 'green', 'blue', 'orange', 'yellow'];

      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
};
</script>
