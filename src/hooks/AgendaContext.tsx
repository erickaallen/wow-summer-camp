import React, { createContext, useContext, ReactNode } from 'react';
import { useAgenda } from './useAgenda';
import { useReminders } from './useReminders';

type AgendaContextType = ReturnType<typeof useAgenda> & ReturnType<typeof useReminders>;

const AgendaContext = createContext<AgendaContextType | null>(null);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const agenda = useAgenda();
  const reminders = useReminders();

  return (
    <AgendaContext.Provider value={{ ...agenda, ...reminders }}>
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgendaContext(): AgendaContextType {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgendaContext must be used inside AgendaProvider');
  return ctx;
}
