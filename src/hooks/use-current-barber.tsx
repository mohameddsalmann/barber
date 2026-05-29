import { createContext, useContext } from "react";
import { barbers, type Barber } from "@/mock/data";
// TODO: replace with authenticated user from API/session

const CurrentBarberContext = createContext<Barber>(barbers[0]);

export function CurrentBarberProvider({ children }: { children: React.ReactNode }) {
  // TODO: fetch from auth session instead of barbers[0]
  const me = barbers[0];
  return (
    <CurrentBarberContext.Provider value={me}>
      {children}
    </CurrentBarberContext.Provider>
  );
}

export function useCurrentBarber(): Barber {
  return useContext(CurrentBarberContext);
}
