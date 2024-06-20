import create from "zustand";
import { io, Socket } from "socket.io-client";

interface ISocketState {
  socket: Socket | null;
  connect: (memberId: string, isQuery: boolean) => void;
  disconnect: () => void;
}

const useSocketStore = create<ISocketState>((set, get) => ({
  socket: null,
  connect: (memberId, isQuery) => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL!;

    if (!get().socket) {
      const options: any = {
        transports: ["websocket"],
        upgrade: false,
      };

      if (isQuery) {
        options.query = { memberId };
      }

      const socket = io(socketUrl, options);

      socket.on("connect", () => {
        console.log("socket URL : ", socketUrl);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      set({ socket });
    }
  },
  disconnect: () => {
    const { socket } = get();
    socket?.disconnect();
    set({ socket: null });
  },
}));

export default useSocketStore;
