<template>
  <div style="height: 100%" class="blue-grey lighten-5 text-center">
    <v-app-bar color="#00a884" height="100" elevation="0" rounded="0">
      <v-list color="transparent" class="pl-0 ml-0">
        <v-list-item class="mt-4 pl-0 ml-0">
          <v-btn icon @click="$emit('close')" aria-label="Go Back" class="mr-3">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title class="text-h6 white--text">
              Contact Info
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
    </v-app-bar>

    <div v-if="chatInfo.chat_type == 'direct'">
      <v-container class="mt-5" fluid>
        <v-list-item-avatar size="200">
          <v-img
            width="200"
            v-if="chatInfo.info.image"
            :src="chatInfo.info.image"
            @click="$emit('openImage', chatInfo.info.image)"
            style="cursor: pointer"
          ></v-img>
          <v-img v-else src="@/assets/placeholder.jpg" width="200"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ chatInfo.info.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ chatInfo.info.username
            }}<span class="text--disabled font-weight-black"
              >#{{ chatInfo.info.user_id }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-container>
      <v-card class="mt-10 px-4 pb-2" flat style="text-align: left">
        <v-card-text class="pl-3">Your name</v-card-text>
      </v-card>
    </div>
    <div v-else>
      <v-container class="mt-5" fluid>
        <v-list-item-avatar size="200">
          <v-img
            width="200"
            v-if="chatInfo.info.chat_image"
            :src="chatInfo.info.chat_image"
            @click="$emit('openImage', chatInfo.info.chat_image)"
            style="cursor: pointer"
          ></v-img>
          <v-img
            v-else
            src="@/assets/placeholder-group.png"
            width="200"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ chatInfo.info.chat_name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-container>
      <v-card class="mt-10 px-4 pb-2" flat style="text-align: left">
        <v-list class="mt-0 pt-0" subheader two-line>
          <v-subheader>{{ chatInfo.info.members.length }} members </v-subheader>

          <v-list-item
            v-for="(member, index) in chatInfo.info.members"
            :key="member.user_id"
            @click="$emit('setCurrentUserChat', member)"
            class="py-0 my-0"
            @mouseover="showArrow = index"
            @mouseleave="showArrow = null"
            :disabled="member.user_id == user.user_id"
          >
            <v-list-item-avatar size="50">
              <v-img width="50" v-if="member.image" :src="member.image"></v-img>
              <v-img v-else src="@/assets/placeholder.jpg" width="50"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{
                member.user_id == user.user_id ? 'You' : member.username
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action
              v-if="member.user_id == user.user_id"
              style="font-size: 0.8rem !important"
            >
              <v-chip color="primary" x-small>
                <span>Group Admin</span>
              </v-chip>
            </v-list-item-action>

            <v-list-item-action>
              <v-menu
                bottom
                left
                offset-y
                v-if="user.user_id == chatInfo.info.admin_user_id"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    aria-label="User Menu"
                    v-show="
                      member.user_id != user.user_id && showArrow == index
                    "
                  >
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list width="150" class="pt-0 pb-0 ma-1">
                  <v-list-item link>
                    <v-list-item-title>Remove</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showArrow: -1,
    };
  },
  props: {
    chatInfo: {
      type: Object,
    },
    user: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped></style>
