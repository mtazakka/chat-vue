const Chat = require('./models/chat');

var load = [];
Chat.find((err, result) => {
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      load.push(result[i]);
    }
  }
  if(err){
    console.log(err)
  }
});
/* abstract */ 
class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = load;
  };

  saveMessage(message) {
    try {
      Chat.create(message)
      this.messages.push(message);
    } catch (e) {
    }
  };

  deleteMessage(id) {
    try {
      Chat.deleteOne({id: id}).exec();
      this.messages = this.messages.filter(item => {
        if(item.id != id) {
        return item  
        } 
      })
    } catch (err) {
      console.log(err)
    }
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