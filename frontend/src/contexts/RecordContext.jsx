import React from "react";
import { useState, createContext } from "react";

export const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  
  const [hostedZones, setHostedZones] = useState([]);
  const [records, setRecords] = useState([]);

  const [hostedZone, setHostedZone] = useState({});
  const [record, setRecord] = useState({});

  return (
    <RecordContext.Provider
      value={{
        hostedZones,
        setHostedZones,
        records,
        setRecords,
        hostedZone,
        setHostedZone,
        record,
        setRecord,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};
