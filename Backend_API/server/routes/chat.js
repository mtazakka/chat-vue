import express from 'express';
// controllers
import chat from '../controllers/chat.js';

const router = express.Router();

router
  .get('/', chat.onGetAllChats)
  .post('/', chat.onCreateChat)
  .get('/:id', chat.onGetChatById)
  .delete('/:id', chat.onDeleteChatById)

export default router;