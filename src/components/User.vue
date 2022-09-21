<script>
import StatusIcon from "./StatusIcon.vue";

export default {
  name: "ComponentUser",
  components: { StatusIcon },
  emits: ["select"],
  data() {
    return {
      count: 0,
    };
  },
  props: {
    user: Object,
    selected: Boolean,
  },
  methods: {
    onClick() {
      this.$emit("select");
    },
  },
  computed: {
    status() {
      return this.user.connected ? "online" : "offline";
    },
  },
};
</script>
<template>
  <div class="user" @click="onClick" :class="{ selected: selected }">
    <div class="description">
      <div class="name">
        {{ user.username }} {{ user.self ? " (me)" : "" }}
      </div>
      <div class="status">
        <status-icon :connected="user.connected" />{{ status }}
      </div>
    </div>
    <div v-if="user.hasNewMessages" class="new-messages">!</div>
  </div>
</template>

<style scoped>
.selected {
  background-color: #1164a3;
  margin-left: -8px;
  margin-right: -8px;
  color: white;
  padding: 10px;
}

.user {
  padding: 10px;
  margin-left: -8px;
  margin-right: -8px;

}

.description {
  display: inline-block;
}

.status {
  color: #92959e;
  padding-left: 10px;
  margin-top: -5px;
}

.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-top: 10px;
}
</style>
