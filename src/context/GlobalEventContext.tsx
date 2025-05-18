import React, { createContext, useContext, useState } from "react";

interface CompletedEvent {
  instanceId: string;
  didWin: boolean;
  medalImage: string;
}

interface GlobalEventContextProps {
  completedEvents: CompletedEvent[];
  addCompletedEvent: (event: CompletedEvent) => void;
  removeCompletedEvent: (id: string) => void;
}

const GlobalEventContext = createContext<GlobalEventContextProps>({
  completedEvents: [],
  addCompletedEvent: () => {},
  removeCompletedEvent: () => {},
});

export const GlobalEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [completedEvents, setCompletedEvents] = useState<CompletedEvent[]>([]);

  const addCompletedEvent = (event: CompletedEvent) => {
    setCompletedEvents((prev) => [...prev, event]);
  };

  const removeCompletedEvent = (id: string) => {
    setCompletedEvents((prev) => prev.filter((e) => e.instanceId !== id));
  };

  return (
    <GlobalEventContext.Provider
      value={{
        completedEvents,
        addCompletedEvent,
        removeCompletedEvent,
      }}
    >
      {children}
    </GlobalEventContext.Provider>
  );
};

export const useGlobalEvent = () => useContext(GlobalEventContext);
