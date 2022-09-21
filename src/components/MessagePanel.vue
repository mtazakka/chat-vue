<!-- <script>
import { useStore } from "../stores/piniaChat.js"
import StatusIcon from "./StatusIcon.vue";

export default {
  name: "MessagePanel",
  emits: ["input", "delete", "resend"],
  setup() {
    const Chat = useStore();
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
      bdelete: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
    },
    deleteChat(message, index) {
      this.$emit("delete", message, index);
    },
    resendChat(message) {
      this.$emit("resend", message)
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
</script> -->
<script>
import { useChatStore } from "../stores/chat";
import StatusIcon from "./StatusIcon.vue";

export default {
  name: "MessagePanel",
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
      bdelete: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
    },

    deleteCHAT(message, index) {
      this.$emit("deleteChat", message, index);
    },

    resendCHAT(message) {
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
          <li v-for="(message, index) in user.messages" :key="index" :class="message">
            <div v-if="displaySender(message, index)" class="sender">
              {{ message.fromSelf ? "(yourself)" : user.username }}
            </div>
            {{ message.content }}
          </li>
        </ul>
      </div>
      <div>
        <form @submit.prevent="onSubmit" class="col-md-12">
          <textarea v-model="input" placeholder="Write a message..." class="input" @keypress.enter="onSubmit" />
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
}

.sender {
  font-weight: bold;
  margin-top: 5px;
  text-align: left;
}

.receiver {
  text-align: right;
}


.input {
  width: 85%;
  resize: none;
  padding-top: 12px;
  padding-left: 20px;
  margin-left: 20px;
  line-height: 1;
  border-radius: 25px;
  border: 1px solid lightgray;
}

.send-button {
  vertical-align: top;
  border-radius: 50%;
  margin-left: 10px;
}
</style>
