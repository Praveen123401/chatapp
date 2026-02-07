import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore.js";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  groupMessages: [],
  typingUsers: {},
  replyToMessage: null,
  editingMessage: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (name, members) => {
    try {
      const res = await axiosInstance.post("/groups", { name, members });
      set({ groups: [res.data, ...get().groups] });

      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroup", res.data._id);

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      throw error;
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages, replyToMessage } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        ...messageData,
        replyTo: replyToMessage?._id || null,
      });
      set({ messages: [...messages, res.data] });
      set({ replyToMessage: null });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (groupId, messageData) => {
    const { groupMessages, replyToMessage } = get();
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/messages`, {
        ...messageData,
        replyTo: replyToMessage?._id || null,
      });
      set({ groupMessages: [...groupMessages, res.data], replyToMessage: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send group message");
    }
  },

  editMessage: async (messageId, text) => {
    try {
      const res = await axiosInstance.patch(`/messages/${messageId}`, { text });
      const updatedMessages = get().messages.map((message) =>
        message._id === messageId ? res.data : message
      );
      set({ messages: updatedMessages, editingMessage: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  deleteMessage: async (messageId, forEveryone = false) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}?forEveryone=${forEveryone}`);
      if (forEveryone) {
        const updatedMessages = get().messages.map((message) =>
          message._id === messageId
            ? { ...message, deletedForEveryone: true, text: "", image: "" }
            : message
        );
        set({ messages: updatedMessages });
      } else {
        set({ messages: get().messages.filter((message) => message._id !== messageId) });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/messages/${messageId}/reactions`, { emoji });
      const updatedMessages = get().messages.map((message) =>
        message._id === messageId ? res.data : message
      );
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to react");
    }
  },

  setReplyToMessage: (message) => set({ replyToMessage: message }),
  clearReplyToMessage: () => set({ replyToMessage: null }),
  setEditingMessage: (message) => set({ editingMessage: message }),
  clearEditingMessage: () => set({ editingMessage: null }),

  handleTyping: (receiverId, isTyping) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !receiverId) return;
    socket.emit("typing", { receiverId, isTyping });
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("userTyping", ({ senderId, isTyping }) => {
      set({
        typingUsers: {
          ...get().typingUsers,
          [senderId]: isTyping,
        },
      });
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("userTyping");
  },

  markMessageAsRead: (messageId, senderId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !messageId || !senderId) return;
    socket.emit("messageRead", { messageId, senderId });

    const updatedMessages = get().messages.map((message) =>
      message._id === messageId ? { ...message, status: "read" } : message
    );
    set({ messages: updatedMessages });
  },

  subscribeToReadReceipts: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("messageReadReceipt", ({ messageId }) => {
      const updatedMessages = get().messages.map((message) =>
        message._id === messageId ? { ...message, status: "read" } : message
      );
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromReadReceipts: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("messageReadReceipt");
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set((state) => {
        const exists = state.messages.some((message) => message._id === newMessage._id);
        if (exists) return state;
        return { messages: [...state.messages, newMessage] };
      });
    });

    socket.on("messageUpdated", (updatedMessage) => {
      const updatedMessages = get().messages.map((message) =>
        message._id === updatedMessage._id ? updatedMessage : message
      );
      set({ messages: updatedMessages });
    });

    socket.on("messageDeleted", ({ messageId, deletedForEveryone, deletedFor }) => {
      if (deletedForEveryone) {
        const updatedMessages = get().messages.map((message) =>
          message._id === messageId
            ? { ...message, deletedForEveryone: true, text: "", image: "" }
            : message
        );
        set({ messages: updatedMessages });
      } else if (deletedFor?.includes(useAuthStore.getState().authUser?._id)) {
        set({ messages: get().messages.filter((message) => message._id !== messageId) });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageUpdated");
    socket.off("messageDeleted");
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;
    socket.on("groupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;
      set((state) => {
        const exists = state.groupMessages.some((message) => message._id === newMessage._id);
        if (exists) return state;
        return { groupMessages: [...state.groupMessages, newMessage] };
      });
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("groupMessage");
  },

  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      selectedGroup: null,
      groupMessages: [],
      replyToMessage: null,
      editingMessage: null,
    }),
  setSelectedGroup: (selectedGroup) => {
    const socket = useAuthStore.getState().socket;
    if (socket && selectedGroup?._id) socket.emit("joinGroup", selectedGroup._id);

    set({
      selectedGroup,
      selectedUser: null,
      messages: [],
      replyToMessage: null,
      editingMessage: null,
    });
  },
}));
