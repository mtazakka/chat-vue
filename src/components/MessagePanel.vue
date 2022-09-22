<script>
import { useChatStore } from "../stores/chat";
import StatusIcon from "./StatusIcon.vue";

export default {
  name: "ComponentsMessagePanel",
  emits: ["input", "deleteChat", "resendChat"],
  setup() {
    const Chat = useChatStore();
    return { Chat };
  },
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      input: "",
      failed: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
    },

    deleteChat(message, index) {
      this.$emit("deleteChat", message, index);
    },

    resend(message) {
      this.$emit("resendChat", message);
    },

    displaySender(message, index) {
      return (
        index === 0 ||
        this.user.messages[index - 1].fromSelf !==
        this.user.messages[index].fromSelf
      );
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    },
  },
};
</script>
<template>
  <div class="card mb-4">
    <h3 class="header">
      <status-icon :connected="user.connected" />{{ user.username }}
    </h3>
    <div class="container row g-3 main-panel">
      <div>
        <ul class="messages">
          <li v-for="(message, index) in user.messages" :key="index" :class="message.fromSelf ? 'sender' : 'receiver'">
            <div v-if="message.fromSelf" class="sender">
              <div class="message">
                <button class="btn btn-danger btn-sm" title="delete"
                  @click="alert(deleteChat(message, index))"></button>
                {{ message.fromSelf ? "(me)" : user.username }}
                <sup>{{ message.date }}</sup>
              </div>
              <br>
              {{ message.content }}
              <div>
                <button v-if="!message.sent && message.fromSelf" type="button" class="btn btn-outline-warning btn-sm"
                  id="resend" @click="resend(message)">&#x21bb</button>
              </div>
            </div>

            <div v-else class="receiver">
              <div class="message">
                <sup>{{ message.date }}</sup>
                {{ message.fromSelf ? "(me)" : user.username }}
              </div>
              <br>
              {{ message.content }}
            </div>
          </li>
        </ul>
      </div>
      <div>
        <form @submit.prevent="onSubmit" class="col-md-12">
          <input type="text" v-model="input" placeholder="Write a message..." class="input" />
          <button :disabled="!isValid" class="send-button btn btn-primary">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header {
  line-height: 80px;
  background-color: rgba(243, 243, 243, 0.982);
  margin-left: 10px;
  margin-right: -10px;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
}

.card {
  border: none;
}

.main-panel {
  margin-top: 5px;
  margin-left: 10px;
  border: 3px solid rgba(243, 243, 243, 0.982);
  margin-bottom: -22px;
}

.messages {
  padding-left: 20px;
  padding-right: 20px;
  overflow-y: scroll;
  height: 400px;
}


.message {
  list-style: none;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: -22px;
}

.sender {
  /* font-weight: bold; */
  margin-top: 5px;
  text-align: left;
  list-style: none;
  width: max-content;
  margin-bottom: 20px;
  font-size: 16px;
}

.receiver {
  margin-left: auto;
  margin-right: 0;
  margin-top: 5px;
  text-align: right;
  list-style: none;
  margin-bottom: 20px;
  font-size: 16px;
}


.input {
  width: 85%;
  max-height: 40px;
  /* padding-top: 8px; */
  padding-left: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  line-height: 3;
  border-radius: 25px;
  border: 1px solid lightgray;
}

.send-button {
  vertical-align: top;
  border-radius: 50%;
  margin-left: 10px;
}

#resend {
  margin-left: 10px;
  margin-top: -5px;
  border-radius: 25px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 18px;
}
</style>
