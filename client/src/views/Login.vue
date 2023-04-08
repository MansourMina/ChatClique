<template>
  <v-container fluid fill-height style="height: 100vh">
    <v-layout align-center justify-center v-if="!signUp">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-0">
          <v-toolbar-title class="black--text text-center"
            >Welcome to Chat Clique</v-toolbar-title
          >
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                name="username"
                v-model="username"
                label="username"
                type="text"
                color="green darken-1"
                @keyup.enter="login()"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                v-model="password"
                label="Password"
                type="password"
                color="green darken-1"
                @keyup.enter="login()"
              ></v-text-field>

              <p class="red--text" v-if="showWrong">
                Falscher Benutzername oder Passwort
              </p>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              elevation="0"
              color="green darken-1 white--text"
              @click="login()"
              block
              >Login</v-btn
            >
          </v-card-actions>
          <v-row wrap no-gutters class="ma-6">
            <v-col cols="4" class="text-center mt-3">
              <v-divider />
            </v-col>
            <v-col cols="4" class="text-center"> or Sign in with </v-col>
            <v-col cols="4" class="text-center mt-3">
              <v-divider />
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn
              tile
              color="blue lighten-5 "
              elevation="0"
              width="50%"
              outlined
            >
              <v-icon left color="green" class="mr-10"> mdi-google </v-icon>
              <span class="black--text">Google</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center v-if="signUp">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-0 text-center">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card class="elevation-0">
                <v-toolbar-title class="black--text text-center"
                  >Welcome to Chat Clique</v-toolbar-title
                >
                <v-card-text>
                  <v-form>
                    <v-text-field
                      prepend-icon="mdi-account"
                      name="username"
                      v-model="username"
                      label="username"
                      type="text"
                      color="green darken-1"
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      prepend-icon="mdi-lock"
                      name="password"
                      v-model="password"
                      label="Password"
                      type="password"
                      color="green darken-1"
                    ></v-text-field>
                  </v-form>
                </v-card-text>

                <v-row wrap no-gutters class="ma-6">
                  <v-col cols="4" class="text-center mt-3">
                    <v-divider />
                  </v-col>
                  <v-col cols="4" class="text-center"> or Sign in with </v-col>
                  <v-col cols="4" class="text-center mt-3">
                    <v-divider />
                  </v-col>
                </v-row>
                <v-card-actions class="justify-center">
                  <v-btn
                    tile
                    color="blue lighten-5 "
                    elevation="0"
                    width="50%"
                    outlined
                  >
                    <v-icon left color="green" class="mr-10">
                      mdi-google
                    </v-icon>
                    <span class="black--text">Google</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-window-item>

            <v-window-item :value="2">
              <v-card-title class="text-h6 font-weight-regular justify-center">
                <span>Profile Information</span>
              </v-card-title>
              <v-card-subtitle class="mt-2 font-weight-regular justify-center">
                <span
                  >Please provide your name and an optional profile photo</span
                >
              </v-card-subtitle>
              <v-file-input type="file" ref="fileinput" style="display: none" />
              <v-btn x-large fab @click="clearFiles">
                <v-avatar size="48" v-if="imageFile">
                  <img
                    alt="Avatar"
                    src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                  />
                </v-avatar>
                <v-icon v-else>mdi-camera-plus</v-icon>
              </v-btn>
              <v-card-text>
                <v-text-field
                  label="Type your name"
                  color="green darken-1"
                ></v-text-field>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="3">
              <v-card-text>
                <v-text-field label="Password" type="password"></v-text-field>
                <v-text-field
                  label="Confirm Password"
                  type="password"
                ></v-text-field>
                <span class="text-caption grey--text text--darken-1">
                  Please enter a password for your account
                </span>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="4">
              <div class="pa-4 text-center">
                <v-img
                  class="mb-4"
                  contain
                  height="128"
                  src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                ></v-img>
                <h3 class="text-h6 font-weight-light mb-2">
                  Welcome to Vuetify
                </h3>
                <span class="text-caption grey--text"
                  >Thanks for signing up!</span
                >
              </div>
            </v-window-item>
          </v-window>

          <v-card-actions>
            <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="step === 3"
              color="primary"
              depressed
              @click="step++"
            >
              Next
            </v-btn>
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
      imageFile: null,
      showWrong: false,
      signUp: false,
      step: 1,
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
    clearFiles() {
      this.$nextTick(() => {
        this.$refs.fileinput.$el.click();
      });
    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Sign-up';
        case 2:
          return 'Create a password';
        default:
          return 'Account created';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
