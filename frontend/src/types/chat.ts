export interface ChatSource {
  page: number;
}

export interface ChatResponse {
  success: boolean;
  question?: string;
  reply?: string;
  sources?: ChatSource[];
  error?: string;
}

export interface ChatRequestPayload {
  message: string;
}
