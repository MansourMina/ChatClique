<template>
  <v-container style="height: 100vh; background-color: #f0f2f5">
    <v-container
      style="
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div class="text-center">
        <div class="mb-10">
          <v-img src="@/assets/logo.png" width="220" class="mx-auto" />
        </div>

        <h1 class="text--secondary">CHAT CLIQUE</h1>
        <h2 class="text--disabled">Connect and Chat with Friends</h2>
        <p class="text--disabled">
          A Fun and Secure Way to Stay Connected and Chat with Your Closest
          Friends
        </p>
      </div>
    </v-container>

    <v-sheet color="#006bff" elevation="1" height="8" width="120%"></v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'Start',
};
</script>

<style scoped></style>
