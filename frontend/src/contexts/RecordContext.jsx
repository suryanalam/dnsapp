import React from "react";
import { useState, createContext } from "react";

export const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState({});

  return (
    <RecordContext.Provider value={{ records, setRecords, record, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
