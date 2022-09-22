import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const CHAT_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    type: String,
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

/**
 * @param {String} firstName
 * @param {String} lastName
 * @returns {Object} new chat object created
 */
chatSchema.statics.createchat = async function (firstName, lastName, type) {
  try {
    const chat = await this.create({ firstName, lastName, type });
    return chat;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} id, chat id
 * @return {Object} Chat profile object
 */
chatSchema.statics.getChatById = async function (id) {
  try {
    const chat = await this.findOne({ _id: id });
    if (!chat) throw ({ error: 'No chat with this id found' });
    return chat;
  } catch (error) {
    throw error;
  }
}

/**
 * @return {Array} List of all chats
 */
chatSchema.statics.getChats = async function () {
  try {
    const chats = await this.find();
    return chats;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} ids, string of chat ids
 * @return {Array of Objects} chats list
 */
chatSchema.statics.getChatByIds = async function (ids) {
  try {
    const chats = await this.find({ _id: { $in: ids } });
    return chats;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} id - id of chat
 * @return {Object} - details of action performed
 */
chatSchema.statics.deleteByChatById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
}
chatSchema.statics.deleteChat= async function () {
  try {
    const result = await this.remove();
    return result;
  } catch (error) {
    throw error;
  }
}

export default mongoose.model("Chat", chatSchema);