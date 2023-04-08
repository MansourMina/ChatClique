<template>
  <v-container
    fluid
    fill-height
    style="height: 100vh; background-color: #f0f2f5"
    text-center
    class="pl-0 pr-0"
  >
    <v-layout align-center justify-center v-if="!signUp">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-0" color="transparent">
          <v-card-text>
            <p class="font-weight-light text-h3 text--primary">CHAT CLIQUE</p>
            <p>Connect and Chat with Friends</p>
            <div class="text--primary">
              A Fun and Secure Way to Stay Connected and Chat with Your Closest
              Friends
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-sheet color="green accent-3" elevation="1" height="8" width="120%" ></v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.containerHome {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
