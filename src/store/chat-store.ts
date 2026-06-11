import { create } from "zustand";
import { db } from "@/lib/firebase";
import { ChatRoom, ChatMessage } from "@/types/chat";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { useNotificationStore } from "@/store/notification-store";

interface ChatState {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  isRoomsLoading: boolean;
  isMessagesLoading: boolean;
  activeRoomId: string | null;
  getOrCreateChatRoom: (
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string
  ) => Promise<ChatRoom>;
  subscribeToChatRooms: (userId: string, role: "buyer" | "seller" | "admin") => Unsubscribe;
  subscribeToMessages: (roomId: string) => Unsubscribe;
  sendMessage: (
    roomId: string,
    senderId: string,
    senderName: string,
    recipientId: string,
    content: string
  ) => Promise<void>;
  markAsRead: (roomId: string, userId: string) => Promise<void>;
  setActiveRoomId: (roomId: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  messages: [],
  isRoomsLoading: false,
  isMessagesLoading: false,
  activeRoomId: null,

  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),

  getOrCreateChatRoom: async (buyerId, buyerName, sellerId, sellerName) => {
    const roomId = `chat_${buyerId}_${sellerId}`;
    const roomRef = doc(db, "chats", roomId);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      return roomSnap.data() as ChatRoom;
    }

    const newRoom: ChatRoom = {
      id: roomId,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      lastMessage: "",
      lastMessageAt: new Date().toISOString(),
      lastSenderId: "",
      unreadByBuyer: false,
      unreadBySeller: false,
    };

    await setDoc(roomRef, newRoom);
    return newRoom;
  },

  subscribeToChatRooms: (userId) => {
    set({ isRoomsLoading: true });
    const qBuyer = query(collection(db, "chats"), where("buyerId", "==", userId));
    const qSeller = query(collection(db, "chats"), where("sellerId", "==", userId));

    let buyerRooms: ChatRoom[] = [];
    let sellerRooms: ChatRoom[] = [];

    const updateRooms = () => {
      const allRooms = [...buyerRooms, ...sellerRooms];
      const uniqueRooms = allRooms.filter(
        (room, index, self) => self.findIndex((r) => r.id === room.id) === index
      );
      uniqueRooms.sort(
        (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
      set({ rooms: uniqueRooms, isRoomsLoading: false });
    };

    const unsubBuyer = onSnapshot(
      qBuyer,
      (snapshot) => {
        buyerRooms = snapshot.docs.map((docSnap) => docSnap.data() as ChatRoom);
        updateRooms();
      },
      (error) => {
        console.error("Error subscribing to buyer chat rooms:", error);
        set({ isRoomsLoading: false });
      }
    );

    const unsubSeller = onSnapshot(
      qSeller,
      (snapshot) => {
        sellerRooms = snapshot.docs.map((docSnap) => docSnap.data() as ChatRoom);
        updateRooms();
      },
      (error) => {
        console.error("Error subscribing to seller chat rooms:", error);
        set({ isRoomsLoading: false });
      }
    );

    return () => {
      unsubBuyer();
      unsubSeller();
    };
  },

  subscribeToMessages: (roomId) => {
    set({ isMessagesLoading: true, messages: [] });
    const messagesRef = collection(db, "chats", roomId, "messages");
    // Querying messages sorted by createdAt ascending
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const msgsList = snapshot.docs.map((docSnap) => docSnap.data() as ChatMessage);
        // Additional safe sorting on client-side to be absolute sure
        msgsList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        set({ messages: msgsList, isMessagesLoading: false });
      },
      (error) => {
        console.error("Error subscribing to messages:", error);
        // Fallback query if index has not finished creating yet
        const fallbackQuery = query(messagesRef);
        onSnapshot(fallbackQuery, (snapshot) => {
          const msgsList = snapshot.docs.map((docSnap) => docSnap.data() as ChatMessage);
          msgsList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          set({ messages: msgsList, isMessagesLoading: false });
        });
      }
    );
  },

  sendMessage: async (roomId, senderId, senderName, recipientId, content) => {
    if (!content.trim()) return;

    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage: ChatMessage = {
      id: messageId,
      senderId,
      senderName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // 1. Add message doc
    const msgRef = doc(db, "chats", roomId, "messages", messageId);
    await setDoc(msgRef, newMessage);

    // 2. Update room doc
    const roomRef = doc(db, "chats", roomId);
    const roomSnap = await getDoc(roomRef);
    let isBuyerSender = true;

    if (roomSnap.exists()) {
      const roomData = roomSnap.data() as ChatRoom;
      isBuyerSender = senderId === roomData.buyerId;
    }

    await updateDoc(roomRef, {
      lastMessage: content.trim(),
      lastMessageAt: newMessage.createdAt,
      lastSenderId: senderId,
      unreadByBuyer: !isBuyerSender,
      unreadBySeller: isBuyerSender,
    });

    // 3. Dispatch notification to the other party
    try {
      await useNotificationStore.getState().addNotification({
        userId: recipientId,
        title: `Tin nhắn mới từ ${senderName}`,
        message: content.trim().length > 60 ? `${content.trim().slice(0, 60)}...` : content.trim(),
        type: "new_message",
        productId: roomId, // Storing roomId inside productId for linking/action handling
      });
    } catch (err) {
      console.error("Error dispatching chat notification:", err);
    }
  },

  markAsRead: async (roomId, userId) => {
    const roomRef = doc(db, "chats", roomId);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      const roomData = roomSnap.data() as ChatRoom;
      const updates: Partial<ChatRoom> = {};

      if (userId === roomData.buyerId && roomData.unreadByBuyer) {
        updates.unreadByBuyer = false;
      } else if (userId === roomData.sellerId && roomData.unreadBySeller) {
        updates.unreadBySeller = false;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(roomRef, updates);
      }
    }
  },
}));
