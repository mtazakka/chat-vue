import { defineStore } from 'pinia'
import socket from "../socket";

export const useStore = defineStore({
    id:"chat",
    state: () =>({
        rawItems: []
    }),
    getters:{
    items: (state) => state.rawItems,
    },
    actions:{
        addChat(id, to, content, date){
            try{
                socket.emit("private message", {
                    id,
                    to,
                    content,
                    date
                })
                this.rawItems.push({
                    id,
                    content,
                    date,
                    formSelf: true,
                    sent: true
                })
            } catch (e){
                console.log(e)
            }
        },
        //unsend
        //resend
        // removeChat(msgdelid, to, msgindx) {
        //     socket.emit("delete message", { msgdelid, to, msgindx });
        //     this.rawItems = this.rawItems.filter((item) => {
        //         if (item.id != msgdelid) {
        //         console.log("item", item);
        //         return item;
        //         }
        //     });
        //     // this.rawItems = this.rawItems.filter(item => item.id === id)
        // },

        // updateItem(todo) {
        //     this.rawItems = this.rawItems.map((item) => {
        //         if (item.id === todo.id) {
        //             return todo;
        //         }
        //         return item;
        //     });
        // },
    }
})