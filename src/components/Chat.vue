<script>
import { useChatStore } from "../stores/chat";
import socket from "../socket";
import User from "./User.vue";
import MessagePanel from "./MessagePanel.vue";

export default {
  name: "ComponentsChat",
  emits: ["logOut"],
  setup() {
    const Chat = useChatStore();
    return { Chat };
  },
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [],
      count: 0,
    };
  },
  methods: {
    onMessage(content) {
      const id = Date.now();
      const date = new Date().toLocaleTimeString();
      const to = this.selectedUser.userID;
      if (this.selectedUser) {
        if (socket.connected) {
          this.Chat.addChat(id, content, date, to);
          this.selectedUser.messages.push({
            id,
            content,
            date,
            fromSelf: true,
            sent: true,
          });
        } else {
          this.selectedUser.messages.push({
            id,
            content,
            date,
            fromSelf: true,
            sent: false,
          });
        }
      }
    },

    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
    logOut() {
      socket.on("user disconnected", (id) => {
        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          if (user.userID === id) {
            user.connected = false;
            break;
          }
        }
      });
      this.$emit("logOut");
    },
    deleteChat(messageDel, noMessage) {
      console.log("onMesag", messageDel);
      const to = this.selectedUser.userID;
      const idMessage = messageDel.id;
      if (this.selectedUser) {
        this.Chat.removeChat(idMessage, to, noMessage);
        this.selectedUser.messages = this.selectedUser.messages.filter(
          (item) => {
            if (item.id != idMessage) {
              return item;
            }
          }
        );
      }
    },

    resendChat(msgResend) {
      console.log("resendChat", msgResend);
      const id = msgResend.id;
      const content = msgResend.content;
      const date = msgResend.date;
      const to = this.selectedUser.userID;
      if (this.selectedUser) {
        if (socket.connected) {
          this.Chat.addChat(id, content, date, to);
          this.selectedUser.messages.map((item) => {
            if (item.id == id) {
              item.sent = true;
            }
            return item;
          });
        } else {
          this.selectedUser.messages.map((item) => {
            if (item.id == id) {
              item.sent = false;
            }
            return item;
          });
        }
      }
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

    //users handle
    //make socket.once so that resend work
    socket.once("users", (users) => {
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

    socket.on("private message", ({ id, content, date, from, to, sent }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            id,
            content,
            date,
            fromSelf,
            sent,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });

    socket.on("delete message", ({ to, from, noMessage }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages = user.messages.filter((item, index) => {
            if (index != noMessage) {
              return item;
            }
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  unmounted() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
    socket.off("delete message");
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
              <hr>
              <div>
                <user v-for="user in users" :key="user.userID" :user="user" :selected="selectedUser === user"
                  @select="onSelectUser(user)" />
              </div>
            </div>
            <div class="col-md-9" id="main-panel">
              <message-panel v-if="selectedUser" :user="selectedUser" @input="onMessage" @deleteChat="deleteChat"
                @resendChat="resendChat" />
            </div>
            <div class="col-md-3" id="logout-panel">
              <button class="btn btn-outline-danger" @click="logOut">LOG OUT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<style scoped>
h3 {
  text-align: center;
  font-weight: bold;
}

.container-fluid {
  margin-top: 20px;
  width: 70%;
}

.container {
  border: 10px solid white;
}

#header-left-panel {
  padding-top: 25px;
  /* text-align: center; */
  background-color: rgba(243, 243, 243, 0.982);
  height: 607px;
  overflow-y: scroll;
  border-radius: 10px 10px 0 0;
}

#logout-panel {
  margin-top: 2px;
  padding-top: 0;
  /* padding-left: 75px; */
  text-align: center;
  border: none;
}
</style>
