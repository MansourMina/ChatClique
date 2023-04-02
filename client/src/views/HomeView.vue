<template>
  <v-container
    fluid
    max-height="100vh"
    height="100vh"
    style="overflow-y: hidden"
  >
    <v-timeline color="green">
      <v-timeline-item
        v-for="message in messages"
        :key="message.id"
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
          :style="`text-align: ${message.ownMessage ? 'right' : 'left'} `"
        >
          <v-card-text
            :class="`pb-0 pt-2 ${randomColorPicker()}--text`"
            v-if="!message.ownMessage"
          >
            {{ message.sender }}
          </v-card-text>
          <v-card-text class="pt-2 pb-2"> {{ message.text }} </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-footer padless absolute>
      <v-col class="text-center mt-0 pt-0" cols="12">
        <v-text-field
          value="John Doe"
          label="Solo"
          solo
          hide-details
          dense
        ></v-text-field>
      </v-col>
    </v-footer>
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
          id: 1,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
          id: 2,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
          id: 3,
        },
        {
          text: 'Aber wenn du nicht bankaustria  bist wird dauern',
          sender: 'Diesdas hal',
          ownMessage: false,
          id: 4,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
          id: 5,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
          id: 6,
        },
        {
          text: 'Aber wenn du nicht bankaustria  bist wird dauern',
          sender: 'Diesdas hal',
          ownMessage: false,
          id: 7,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
          id: 8,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
          id: 9,
        },
        {
          text: 'Aber wenn du nicht bankaustria  bist wird dauern',
          sender: 'Diesdas hal',
          ownMessage: false,
          id: 10,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
          id: 11,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
          id: 12,
        },
        {
          text: 'Aber wenn du nicht bankaustria  bist wird dauern',
          sender: 'Diesdas hal',
          ownMessage: false,
          id: 13,
        },
        {
          text: 'Ja ich weiss bruder',
          sender: 'Filip',
          ownMessage: false,
          id: 14,
        },
        {
          text: 'okkkkk dsad dsnakdsa dsahkdhsa dshakdhsa dshakdh sadhskah dsakdhsa dshak',
          sender: 'Mina Mansour',
          ownMessage: true,
          id: 15,
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
#button-input {
  position: fixed;
}
</style>
