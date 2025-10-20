"use client";

import { createContext, useReducer, useEffect, ReactNode, Dispatch } from "react";
import type { Table, Settings, GameSession, Sale } from "@/lib/types";
import { format } from "date-fns";

interface AppState {
  tables: Table[];
  settings: Settings;
  sessions: GameSession[];
  sales: Record<string, Sale[]>;
}

type Action =
  | { type: "INITIALIZE_STATE"; payload: AppState }
  | { type: "ADD_TABLE"; payload: Table }
  | { type: "UPDATE_TABLE"; payload: Table }
  | { type: "DELETE_TABLE"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Settings }
  | { type: "START_SESSION"; payload: GameSession }
  | { type: "END_SESSION"; payload: { sessionId: string; cost: number } };

const initialState: AppState = {
  tables: [
    { id: "1", name: "Table 1", status: "available" },
    { id: "2", name: "Table 2", status: "in-use" },
    { id: "3", name: "Table 3", status: "available" },
    { id: "4",name: "Table 4", status: "maintenance" },
  ],
  settings: {
    singleDuration: 45,
    doubleDuration: 60,
    singlePrice: 10,
    doublePrice: 15,
    centuryPrice: 20,
  },
  sessions: [
    {
        id: 'session-1',
        tableId: '2',
        tableName: 'Table 2',
        gameType: 'Single',
        startTime: Date.now() - 1000 * 60 * 30, // 30 mins ago
        player: 'John Smith'
    }
  ],
  sales: {},
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "INITIALIZE_STATE":
      return action.payload;
    case "ADD_TABLE":
      return { ...state, tables: [...state.tables, action.payload] };
    case "UPDATE_TABLE":
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TABLE":
        return { ...state, tables: state.tables.filter(t => t.id !== action.payload) };
    case "UPDATE_SETTINGS":
      return { ...state, settings: action.payload };
    case "START_SESSION":
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
        tables: state.tables.map((t) =>
          t.id === action.payload.tableId ? { ...t, status: "in-use" } : t
        ),
      };
    case "END_SESSION":
      const sessionToEnd = state.sessions.find(s => s.id === action.payload.sessionId);
      if (!sessionToEnd) return state;

      const endTime = Date.now();
      const sale: Sale = {
          sessionId: sessionToEnd.id,
          tableName: sessionToEnd.tableName,
          gameType: sessionToEnd.gameType,
          startTime: sessionToEnd.startTime,
          endTime: endTime,
          cost: action.payload.cost,
      };

      const dateKey = format(new Date(endTime), 'yyyy-MM-dd');
      const todaySales = state.sales[dateKey] ? [...state.sales[dateKey], sale] : [sale];

      return {
        ...state,
        sessions: state.sessions.filter(
          (s) => s.id !== action.payload.sessionId
        ),
        tables: state.tables.map((t) =>
          t.id === sessionToEnd.tableId ? { ...t, status: "available" } : t
        ),
        sales: {
            ...state.sales,
            [dateKey]: todaySales,
        }
      };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem("cueMasterState");
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Basic validation to ensure essential keys exist
        if (parsedState.tables && parsedState.settings && parsedState.sessions && parsedState.sales) {
          dispatch({ type: "INITIALIZE_STATE", payload: parsedState });
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cueMasterState", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [state]);
  

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
