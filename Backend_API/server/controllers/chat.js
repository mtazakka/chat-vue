// utils
import makeValidation from '@withvoid/make-validation';
// models
import ChatModel, { CHAT_TYPES } from '../models/Chat.js';

export default {
  onGetAllChats: async (req, res) => {
    try {
      const chats = await ChatModel.getChats();
      return res.status(200).json({ success: true, chats });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onGetChatById: async (req, res) => {
    try {
      const chat = await ChatModel.getChatById(req.params.id);
      return res.status(200).json({ success: true, chat });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onCreateChat: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          type: { type: types.enum, options: { enum: CHAT_TYPES } },
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { firstName, lastName, type } = req.body;
      const chat = await ChatModel.createChat(firstName, lastName, type);
      return res.status(200).json({ success: true, chat });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onDeleteChatById: async (req, res) => {
    try {
      const chat = await ChatModel.deleteByChatById(req.params.id);
      return res.status(200).json({ 
        success: true, 
        message: `Deleted a count of ${chat.deletedCount} chat.` 
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
}