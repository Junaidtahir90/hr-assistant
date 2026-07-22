import axiosClient from "./axiosClient";
import type {ChatResponse, ChatRequestPayload} from "../types/chat";


// =====================================================
// API
// =====================================================
export const chatApi = {
  getChats: () => axiosClient.get<any>("/chat"),

  sendMessage: (message: string) =>
    axiosClient.post<ChatResponse>("/chat", { message } as ChatRequestPayload),
};