<template>
  <v-container fluid fill-height style="height: 100vh">
    <v-layout align-center justify-center v-if="!showSignUp">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-0">
          <v-toolbar-title class="black--text text-center"
            >Welcome to Chat Clique</v-toolbar-title
          >
          <v-card-text>
            <v-form ref="form">
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
            <v-col cols="4" class="text-center"> or </v-col>
            <v-col cols="4" class="text-center mt-3">
              <v-divider />
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn color="blue lighten-5 " elevation="0" outlined rounded>
              <v-img class="mr-10" src="@/assets/google.png" width="20">
              </v-img>
              <span class="black--text font-weight-black"
                >Continue with Google</span
              >
            </v-btn>
          </v-card-actions>
          <div class="mt-5">
            <v-divider></v-divider>

            <div class="text-center mt-2">
              <span
                >Don't have an account?
                <a
                  class="black--text font-weight-black"
                  @click="clearInput(), (showSignUp = true)"
                  >Sign Up</a
                >
              </span>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center v-if="showSignUp">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-0 text-center">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-title class="text-h6 font-weight-regular justify-center">
                <span>{{ currentTitle }}</span>
              </v-card-title>
              <v-card-subtitle class="mt-2 font-weight-regular justify-center">
                Please provide your profile information and an optional profile
                photo
              </v-card-subtitle>

              <!-- hidden but triggered with JavaScript -->
              <input
                ref="uploader"
                class="d-none"
                type="file"
                @input="onFileChanged"
                accept="image/png, image/jpeg"
              />
              <v-btn
                x-large
                fab
                @click="handleFileImport"
                style="width: 100px; height: 100px"
              >
                <v-avatar size="100" v-if="imageFile">
                  <img alt="Avatar" :src="imageFile" name="Profile Picture" />
                </v-avatar>
                <v-icon v-else>mdi-camera-plus</v-icon>
              </v-btn>
              <v-form ref="form" v-model="step1Valid">
                <v-card-text>
                  <v-text-field
                    label="Type your name"
                    color="green darken-1"
                    v-model="name"
                    :rules="nameRules"
                    required
                    name="Name"
                    clearable
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    name="E-mail"
                    color="green darken-1"
                  ></v-text-field>
                </v-card-text>
              </v-form>
            </v-window-item>
            <v-window-item :value="2">
              <v-card class="elevation-0">
                <v-card-title
                  class="text-h6 font-weight-regular justify-center"
                >
                  <span>{{ currentTitle }}</span>
                </v-card-title>
                <v-card-subtitle
                  class="mt-2 font-weight-regular justify-center"
                >
                  <span>Please provide your username and password </span>
                </v-card-subtitle>

                <v-card-text>
                  <v-form ref="form" v-model="step2Valid">
                    <v-text-field
                      name="username"
                      v-model="username"
                      :rules="nameRules"
                      required
                      label="username"
                      type="text"
                      color="green darken-1"
                      append-icon="mdi-autorenew"
                      @click:append="createUsername"
                      clearable
                    ></v-text-field>

                    <v-text-field
                      id="password"
                      name="password"
                      v-model="password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      color="green darken-1"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules"
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                    <v-progress-linear
                      :color="passwordScore.color"
                      :value="passwordScore.value"
                    ></v-progress-linear>
                    <v-text-field
                      label="Confirm Password"
                      name="Confirm password"
                      type="password"
                      color="green darken-1"
                      v-model="confirmPassword"
                      :rules="[confirmPasswordRules, passwordConfirmationRule]"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-window-item>

            <v-window-item :value="3">
              <div class="pa-4 text-center">
                <v-img
                  class="mb-4"
                  contain
                  height="128"
                  src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                ></v-img>
                <h3 class="text-h6 font-weight-light mb-2">
                  {{ currentTitle }}
                </h3>
                <span class="text-caption grey--text"
                  >Thanks for signing up!</span
                >
              </div>
            </v-window-item>
          </v-window>

          <v-card-actions>
            <v-btn
              text
              @click="
                {
                  if (step == 1) {
                    showSignUp = false;
                    clearInput();
                  } else step--;
                }
              "
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="step != 3"
              :disabled="disableStepper"
              color="primary"
              depressed
              @click="
                {
                  if (step == 2) {
                    signUp();
                  } else step++;
                }
              "
              :loading="loading"
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
import zxcvbn from 'zxcvbn';

export default {
  data() {
    return {
      showTooltip: false,
      step1Valid: true,
      step2Valid: true,
      name: '',
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],

      username: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length >= 5 || 'Name must be atleast 5 characters',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Enter a password',
        (v) => v.length >= 8 || 'Use 8 characters or more for your password',
        (v) =>
          zxcvbn(v).score >= 3 ||
          'Please choose a stronger password. Try a mix of letters, numbers, and symbols.',
      ],
      showPassword: false,
      confirmPassword: '',
      confirmPasswordRules: [(v) => !!v || 'Password is required'],

      imageFile: null,
      showWrong: false,
      showSignUp: false,
      step: 1,
      loading: false,
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
    signUp() {
      this.loading = true;
      setTimeout(() => ((this.loading = false), this.step++), 3000);
    },
    clearFiles() {
      this.$nextTick(() => {
        this.$refs.fileinput.$el.click();
      });
    },
    handleFileImport() {
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      const file = e.target.files[0];
      this.imageFile = URL.createObjectURL(file);
    },
    createUsername() {
      const randomNumber = Math.floor(Math.random() * 899);
      const userMail = this.email.split('@')[0].replace(/[0-9]/g, '');
      this.username = userMail + randomNumber;
    },
    clearInput() {
      this.username = '';
      this.password = '';
      this.email = '';
      this.imageFile = null;
      this.name = '';
    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Profile Information';
        case 2:
          return 'Account Information';
        case 3:
          return 'Welcome to Chat Clique';
        default:
          return 'Account created';
      }
    },
    disableStepper() {
      return (this.step === 1 && !this.step1Valid) ||
        (this.step === 2 && !this.step2Valid) ||
        this.step === 3
        ? true
        : false;
    },
    passwordConfirmationRule() {
      return this.password === this.confirmPassword || 'Password must match';
    },
    passwordScore() {
      const result = zxcvbn(this.password);

      switch (result.score) {
        case 4:
          return {
            color: 'light-blue',
            value: 100,
          };
        case 3:
          return {
            color: 'light-green',
            value: 75,
          };
        case 2:
          return {
            color: 'yellow',
            value: 50,
          };
        case 1:
          return {
            color: 'orange',
            value: 25,
          };
        default:
          return {
            color: 'red',
            value: 0,
          };
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
