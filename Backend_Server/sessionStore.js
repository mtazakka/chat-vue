const Session = require('./models/session');

var load = new Map();
Session.find((err, result) => {
  if (err) throw err;
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      var sesiID = result[i].sessionID
      const usrID = result[i].userID
      const usrname = result[i].username
      const konek = result[i].connected

    //this.messages = result;
    var data = {userID: usrID, username: usrname, connected: konek}
    
    load.set(sesiID, data)
    }
  }
});
/* abstract */ 
class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  removeSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = load;
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    let sesi = {
      sessionID: id,
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    }
    try {
      Session.create(sesi)
      this.sessions.set(id, session);
    } catch (e) {
    }
  }

  removeSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore
};