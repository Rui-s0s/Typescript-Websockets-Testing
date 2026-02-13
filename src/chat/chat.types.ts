export interface JoinRoomPayload {
  room: string;
  username: string;
}

export interface SendMessagePayload {
  room: string;
  username: string;
  message: string;
}

export interface ChatMessage {
  room: string;
  username: string;
  message: string;
  timestamp: number;
  id: string; // Unique ID for the message
}
