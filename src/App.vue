<script >
import SelectUsername from "./components/SelectUsername.vue";
import Chat from "./components/Chat.vue";
import socket from "./socket";

export default {
  name: "app",
  components: {
    Chat,
    SelectUsername,
  },
  data() {
    return {
      usernameAlreadySelected: false,
    };
  },
  methods: {
    onUsernameSelection(username) {
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect() //connect to http network, check the dev.tools network tab
    }
  },
  created() {
    //get session ID dari server
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID }
      socket.connect()
    }

    socket.on("session", ({ sessionID, userID }) => {
      // Disimpan ID untuk reconnect
      socket.auth = { sessionID }
      //store ke localStorage
      localStorage.setItem("sessionID", sessionID);
      // update trus simpan ID user
      socket.userID = userID
    });

    //error handling
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });
  },
  //logout
  destroyed() {
    destroy.off('connect_error');
  }
};
</script>

<template>
  <header>
    <select-username v-if="!usernameAlreadySelected" @input="onUsernameSelection" />
    <chat v-else />
  </header>
</template>

<style scoped>
body {
  margin: 0;
}

@font-face {
  font-family: Lato;
  src: url("/fonts/Lato-Regular.ttf");
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
