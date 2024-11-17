import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // check if the user is blocked
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });

      // check if the Reciever is blocked
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      });
    }
  },

  changeBlock: () =>
    set((state) => ({ ...state, isRecieverBlocked: !state.isRecieverBlocked })),
}));
