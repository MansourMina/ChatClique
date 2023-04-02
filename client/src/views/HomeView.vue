<template>
  <v-container fluid >
    <v-timeline color="green">
      <v-timeline-item
        v-for="message in messages"
        :key="message.text"
        color="red lighten-2"
        hide-dot
        icon="mdi-magnify"
        :left="!message.ownMessage"
      >
        <v-card
          class="elevation-3 d-inline-block"
          max-width="100%"
          min-width="50%"
          :color="message.ownMessage ? '#d9fdd3' : 'white'"
          :style="`text-align: ${message.ownMessage ?  'right':'left'}`"
        >
          <v-card-text :class='`pb-0 pt-2 ${randomColorPicker()}--text`' v-if="!message.ownMessage">
            {{ message.sender }}
          </v-card-text>
          <v-card-text class="pt-2 pb-2"> {{ message.text }} </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>
<script>
export default {
  name: 'MessageViewBody',
  data() {
    return {
      messages: [
        {
          text: 'Aber wenn du nicht bankaustria  bist wird dauern',
          sender: 'Diesdas hal',
          ownMessage: false,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
        },
      ],
    };
  },
  methods: {
    randomColorPicker() {
      let colors = ['red', 'green', 'blue', 'orange', 'yellow'];

      return colors[Math.floor(Math.random() * colors.length)];
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
</style>
