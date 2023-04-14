<template>
  <v-navigation-drawer width="30%" statless app>
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
      placeholder="username#0000 "
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
      class="mt-0 pt-0"
      style="overflow-y: scroll"
      max-height="80vh"
      v-for="user in searchUser"
      :key="user.user_id"
    >
      <v-list-item>
        <v-list-item-avatar class="mt-6">
          <v-img src="@/assets/placeholder.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="mt-6">
          <v-list-item-action-text>
            <v-btn icon @click="$emit('addFriend', user)"
              ><v-icon>mdi-account-plus-outline</v-icon></v-btn
            >
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
    },
    ownUser: {
      type: Object,
    },
  },
  data() {
    return {
      searchAddNewFriend: '',
    };
  },
  computed: {
    searchUser() {
      return this.users.filter(
        (el) =>
          `${el.username.toLowerCase()}#${el.user_id}` ==
            this.searchAddNewFriend.toLowerCase() &&
          el.user_id != this.ownUser.user_id,
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
