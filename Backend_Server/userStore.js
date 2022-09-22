const Chat = require('./models/chat');
const User = require('./models/user');
/* abstract */ 
class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  deleteMessage(id) {
  this.messages = this.messages.filter(item => {
    if(item.id != id) {
    return item  
    } 
  })
  } 

  findMessagesForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

module.exports = {
  InMemoryMessageStore,
};