<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="white">
            <v-toolbar-title class="black--text"
              >Employee-Login</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                name="username"
                v-model="username"
                label="username"
                type="text"
                @keyup.enter="login()"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                v-model="password"
                label="Password"
                type="password"
                @keyup.enter="login()"
              ></v-text-field>

              <p class="red--text" v-if="showWrong">
                Falscher Benutzername oder Passwort
              </p>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      username: '',
      password: '',
      showWrong: false,
    };
  },
  methods: {
    async login() {
      try {
        let { data } = await axios({
          url: 'http://localhost:3000/login',
          method: 'POST',
          contentType: 'application/json',
          data: {
            username: this.username,
            password: this.password,
          },
        });

        localStorage.setItem('user', JSON.stringify(data.user));
        const user = localStorage.getItem('user');
        if (user != null) {
          this.$router.push(`/`);
          this.$router.go();
        }
        return;
      } catch (err) {
        this.showWrong = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
