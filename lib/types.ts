export type GameType = "Single" | "Double" | "Century";

export interface Table {
  id: string;
  name: string;
  status: "available" | "in-use" | "maintenance";
}

export interface Settings {
  singleDuration: number; // in minutes
  doubleDuration: number; // in minutes
  singlePrice: number;
  doublePrice: number;
  centuryPrice: number; // per minute
}

export interface GameSession {
  id: string;
  tableId: string;
  tableName: string;
  gameType: GameType;
  startTime: number; // timestamp
  endTime?: number; // timestamp
  cost?: number;
  player?: string;
}

export interface Sale {
  sessionId: string;
  tableName: string;
  gameType: GameType;
  startTime: number;
  endTime: number;
  cost: number;
}
