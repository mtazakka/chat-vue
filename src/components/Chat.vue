<script>
import socket from "../socket";
import User from "./User.vue";
import MessagePanel from "./MessagePanel.vue";

export default {
  name: "Chat",
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [],
    };
  },
  methods: {
    onMessage(content) {
      if (this.selectedUser) {
        socket.emit("private message", {
          content,
          to: this.selectedUser.userID,
        });
        this.selectedUser.messages.push({
          content,
          fromSelf: true,
        });
      }
    },
    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
  },
  created() {
    socket.on("connect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };

    socket.on("users", (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        this.users.push(user);
      });
      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on("user connected", (user) => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      this.users.push(user);
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });

    socket.on("private message", ({ content, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  destroyed() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  },
};
</script>
<template>
  <div class="container-fluid px-4 py-5 px-md-5 text-center text-lg-start my-8">
    <div class="row gx-lg-5 align-items-center mb-5 justify-content-center">
      <div class="ol-lg-10 mb-5 mb-lg-0 position-relative" id="container">
        <div class="card shadow mb-4">
          <div class="container row g-3">
            <div class="col-md-3" id="header-left-panel">
              <h3>Contacts</h3>
            </div>
            <div class="col-md-9" id="header-main-panel">
              <h3>sabil</h3>
            </div>
            <div class="col-md-3" id="left-panel">
              <user v-for="user in users" :key="user.userID" :user="user" :selected="selectedUser === user"
                @select="onSelectUser(user)" />
            </div>
            <div class="col-md-9" id="main-panel">
              <message-panel v-if="selectedUser" :user="selectedUser" @input="onMessage" />
            </div>
            <div class="col-md-12" id="logout-panel">
              <a href="#">
                <button type="button" class="btn btn-outline-danger">LOG OUT</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<style scoped>
.container-fluid {
  margin-top: 20px;
  width: 70%;
}

.container {
  border: 10px solid white;
}

#header-left-panel {
  padding-top: 25px;
  text-align: center;
  background-color: rgba(243, 243, 243, 0.982);
  height: 80px;
  border-radius: 10px 10px 0 0;
}

#header-main-panel {
  height: 80px;
  background-color: rgba(243, 243, 243, 0.982);
  padding-top: 25px;
  text-align: center;
  border-left: 20px white solid;

}

#left-panel {
  margin-top: 0px;
  height: 527px;
  background-color: rgba(243, 243, 243, 0.982);
  border-top: 3px solid lightgrey;
  border-radius: 0 0 10px 10px;
}

#logout-panel {
  margin-top: 2px;
  padding-top: 0;
  padding-left: 75px;
  /* text-align: center; */
  border: none;
}
</style>
