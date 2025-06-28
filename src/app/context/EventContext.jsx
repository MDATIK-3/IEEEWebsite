"use client";

import React, { createContext, useState, useContext } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
