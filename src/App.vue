<!-- <script>
import SelectUsername from "./components/SelectUsername.vue";
import Chat from "./components/Chat.vue";
import socket from "./socket";

export default {
  name: "App",
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
    //ketika form di submit, dapet auth. baru bisa masuk
    onUsernameSelection(username) {
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    },
    logOut() {
      localStorage.setItem("sessionID", "");
      this.usernameAlreadySelected = false;
    }
  },
  created() {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    //error handle untuk di low level dan middlewhere
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });
  },
  //hook user handler destroy
  unmounted() {
    socket.off("connect_error");
  },
};
</script> -->
<script>
import SelectUsername from "./components/SelectUsername.vue";
import Chat from "./components/Chat.vue";
import socket from "./socket";

export default {
  name: "App",
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
      console.log("username", username);
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    },
    logOut() {
      //localStorage.removeItem("sessionID");
      localStorage.setItem("sessionID", "");
      this.usernameAlreadySelected = false;
    },
  },
  created() {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
        console.log("ini error Login");
      }
    });
  },
  destroyed() {
    socket.off("connect_error");
  },
};
</script>
<template>
  <div id="app">
    <select-username v-if="!usernameAlreadySelected" @submit="onUsernameSelection" />
    <chat v-else @logOut="logOut" />
  </div>
</template>

<style>
body {
  margin: 0;
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
