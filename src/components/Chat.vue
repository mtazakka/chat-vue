<script>
// import socket from "../socket";

</script>
<template>
  <div>
    <div class="left-panel">
      <user v-for="user in users" :key="user.userID" :user="user" :selected="selectedUser === user"
        @select="onSelectUser(user)" />
    </div>
    <message-panel v-if="selectedUser" :user="selectedUser" @input="onMessage" class="right-panel" />
  </div>
</template>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
