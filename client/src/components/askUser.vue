<template>
  <v-card width="400">
    <v-card-title class="text-body-2 font-weight-black mb-4">
      <div>Are you sure you want to leave the group?</div>
    </v-card-title>
    <v-card-subtitle>
      Please note that you won't be able to send any more messages.
    </v-card-subtitle>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn outlined @click="$emit('close')" small> Cancel </v-btn>

      <v-btn  @click="$emit('accept')" color="red darken-4" small dark> Leave </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
