<template>
  <v-app>
    <v-card
      style="overflow: hidden; background-color: #f4f1eb"
      max-height="100vh"
      height="100vh"
      tile
    >
      <v-navigation-drawer width="25%" statless app>
        <v-list color="#00a884" class="pa-3" height="10.6vh">
          <v-list-item class="mt-4">
            <v-list-item-avatar>
              <v-img
                src="https://randomuser.me/api/portraits/women/85.jpg"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-h6 white--text">
                Mina Mansour
              </v-list-item-title>
              <v-list-item-subtitle class="white--text"
                >mansourmina10@gmail.com</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-text-field
          placeholder="Suchen oder neuen Chat beginnen"
          class="pa-4"
          hide-details
          clearable
        >
          <template v-slot:prepend>
            <v-icon class="ml-2 mr-3">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-divider></v-divider>
        <v-list
          three-line
          class="mt-0 pt-0 mb-10"
          style="overflow-y: scroll"
          max-height="80vh"
        >
          <template v-for="(item, index) in items">
            <v-subheader v-if="item.header" :key="item.header"></v-subheader>

            <v-divider
              v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>

            <v-list-item v-else :key="item.title" link class="pl-4 pr-3">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <p>
                  <v-list-item-action-text>{{
                    item.action
                  }}</v-list-item-action-text>
                </p>

                <v-badge color="green" class="mr-3 ml-5 mt-3">
                  <span slot="badge">{{ item.msgcount }}</span>
                </v-badge>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        color="#00a884"
        class="pa-3"
        height="100"
        elevation="0"
        app
        rounded="0"
      >
        <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

        <v-list-item>
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Mina Mansour
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-spacer></v-spacer>

        <v-btn icon color="white">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon color="white">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main hide-overlay>
        <v-container fluid><router-view /></v-container>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    search: '',
    items: [
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        name: 'Filip Wojtasik',
        subtitle: `Ali Connors I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        name: 'Haroon Younas',
        subtitle: `li Connors I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        name: 'Filip Wojtasik',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
      { divider: true, inset: true },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        name: 'Haroon Younas',
        subtitle:
          'li Connors I ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
        msgcount: 6,
        action: '15 min ago',
      },
    ],
  }),
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
