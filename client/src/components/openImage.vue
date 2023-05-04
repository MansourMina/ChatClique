<template>
  <v-card max-width="800" color="transparent" elevation="0">
    <v-toolbar dark color="transparent" elevation="0">
      <v-spacer></v-spacer>
      <v-btn icon dark  @click="$emit('close')" large>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container class=""
      ><v-img
        :src="image"
        max-width="800"
        max-height="590"
        class="mx-auto"
        contain
    /></v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped></style>
