"use client";

import React, { createContext, useContext, useState } from "react";

const RecurrenceContext = createContext();

export function RecurrenceProvider({ children }) {
  const [recurrence, setRecurrence] = useState({
    frequency: "daily",
    interval: 1,
    daysOfWeek: ["Mon"],
    useMultipleWeekdays: false,
    pattern: null,
    startDate: null,
    endDate: null,
    usePattern: false,
    monthlyOcc: "Second",
    monthlyDay: "Tuesday"
  });

  return (
    <RecurrenceContext.Provider value={{ recurrence, setRecurrence }}>
      {children}
    </RecurrenceContext.Provider>
  );
}

export function useRecurrence() {
  return useContext(RecurrenceContext);
}
