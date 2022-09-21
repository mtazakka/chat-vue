import socket from "../socket";
import { defineStore } from "pinia";

export const useChatStore = defineStore({
  id: "chat",
  state: () => ({
    rawItems: [],
  }),
  getters: {
    items: (state) => state.rawItems,
  },
  actions: {
    addChat(id, content, date, to) {
      try {
        socket.emit("private message", {
          id,
          content,
          date,
          to,
        });
        this.rawItems.push({
          id,
          content,
          date,
          fromSelf: true,
          sent: true,
        });
      } catch (error) {
        console.log("lagi error");
      }
    },

    removeChat(idMessage, to, noMessage) {
      socket.emit("delete message", { idMessage, to, noMessage });
      this.rawItems = this.rawItems.filter((item) => {
        if (item.id != idMessage) {
          console.log("item", item);
          return item;
        }
      });

    },

    updateItem(todo) {
      this.rawItems = this.rawItems.map((item) => {
        if (item.id === todo.id) {
          return todo;
        }
        return item;
      });
    },
  },
});