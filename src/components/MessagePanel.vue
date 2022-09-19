<script>
import StatusIcon from "./StatusIcon.vue";

export default {
  name: "MessagePanel",
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
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
    <div class="container row g-3 main-panel">
      <!-- <div>
        <status-icon :connected="user.connected" />{{ user.username }}
      </div> -->
      <div>
        <ul class="messages">
          <li v-for="(message, index) in user.messages" :key="index" class="message">
            <div v-if="displaySender(message, index)" class="sender">
              {{ message.fromSelf ? "(yourself)" : user.username }}
            </div>
            {{ message.content }}
          </li>
        </ul>
      </div>
      <div>
        <form @submit.prevent="onSubmit" class="col-md-12">
          <textarea v-model="submit" placeholder="Write a message..." class="input" />
          <button :disabled="!isValid" class="send-button btn btn-primary">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
    <!-- <table class="main-panel">
      <thead>
        <tr>
          <th>
            <status-icon :connected="user.connected" />{{ user.username }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr id="message-panel">
          <td>
            <ul class="messages">
              <li v-for="(message, index) in user.messages" :key="index" class="message">
                <div v-if="displaySender(message, index)" class="sender">
                  {{ message.fromSelf ? "(yourself)" : user.username }}
                </div>
                {{ message.content }}
              </li>
            </ul>
          </td>
        </tr>
        <br>
        <tr>
          <td id="write-panel">
            <form @submit.prevent="onSubmit" class="col-md-12">
              <textarea v-model="submit" placeholder="Write a message..." class="input" />
              <button :disabled="!isValid" class="send-button btn btn-primary">
                <i class="fa-regular fa-paper-plane"></i>
              </button>
            </form>
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>
<style scoped>
/* .header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
} */

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
