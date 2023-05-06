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

    <v-container class="mt-5" fluid>
      <v-list-item-avatar size="200">
        <v-img
          width="200"
          v-if="friendInfo.image"
          :src="friendInfo.image"
          @click="$emit('openImage', friendInfo.image)"
          style="cursor: pointer"
        ></v-img>
        <v-img v-else src="@/assets/placeholder.jpg" width="200"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ friendInfo.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ friendInfo.username
          }}<span class="text--disabled font-weight-black"
            >#{{ friendInfo.user_id }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-container>
    <v-card class="mt-10 px-4 pb-2" flat style="text-align: left">
      <v-card-text class="pl-3">Your name</v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    friendInfo: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped></style>
