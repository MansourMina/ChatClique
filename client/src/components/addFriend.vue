<template>
  <v-navigation-drawer width="25%" statless app>
    <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
      <v-list color="transparent" class="pl-0 ml-0">
        <v-list-item class="mt-4 pl-0 ml-0">
          <v-btn icon @click="$emit('close')">
            <v-icon class="mr-3" color="white">mdi-arrow-left</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Add new friends
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-app-bar>

    <v-text-field
      placeholder="Suchen oder neuen Chat beginnen"
      class="pa-4"
      hide-details
      clearable
      v-model="searchAddNewFriend"
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
      <!-- <v-subheader v-if="item.header" :key="item.header"></v-subheader> -->

      <!-- <v-divider
                v-else-if="item.divider"
                :key="index"
                :inset="item.inset"
              ></v-divider> -->

      <!-- <v-list-item
        link
        :class="`pl-4 pr-3 ${
          friendChat.chat_id == chat.chat_id ? 'blue-grey lighten-5' : ''
        }`"
        v-for="chat in searchChats"
        :key="chat.user_id"
        @click="setFriendChat(chat)"
      >
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ chat.friend[0].username }}</v-list-item-title>
          <v-list-item-subtitle>
            <span class="font-weight-bold">
              {{
                chat.messages[chat.messages.length - 1].user_id == user.user_id
                  ? 'You:'
                  : ''
              }}
            </span>

            {{
              chat.messages[chat.messages.length - 1].message
            }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <p>
            <v-list-item-action-text>
              {{
                getMessageDate(
                  chat.messages[chat.messages.length - 1].send_date,
                )
              }}</v-list-item-action-text
            >
          </p>

          <v-badge color="green" class="mr-3 ml-5 mt-3">
            <span slot="badge">{{ 2 }}</span>
          </v-badge>
        </v-list-item-action>
      </v-list-item> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      searchAddNewFriend: '',
    };
  },
};
</script>

<style lang="scss" scoped></style>
