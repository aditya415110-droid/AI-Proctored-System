import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CheatingLogContext = createContext();

export const CheatingLogProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    prohibitedObjectCount: 0,
    examId: '',
    username: userInfo?.name || '',
    email: userInfo?.email || '',
    screenshots: [],
  });

  useEffect(() => {
    if (userInfo) {
      setCheatingLog((prev) => ({
        ...prev,
        username: userInfo.name,
        email: userInfo.email,
      }));
    }
  }, [userInfo]);

  const updateCheatingLog = (newLog) => {
    setCheatingLog((prev) => {
      const updated = {
        ...prev,
        ...newLog,

        noFaceCount: Number(newLog.noFaceCount ?? prev.noFaceCount ?? 0),
        multipleFaceCount: Number(newLog.multipleFaceCount ?? prev.multipleFaceCount ?? 0),
        cellPhoneCount: Number(newLog.cellPhoneCount ?? prev.cellPhoneCount ?? 0),
        prohibitedObjectCount: Number(
          newLog.prohibitedObjectCount ?? prev.prohibitedObjectCount ?? 0,
        ),

        screenshots: newLog.screenshots ?? prev.screenshots ?? [], // ✅ FIX
      };

      return updated;
    });
  };

  const resetCheatingLog = (examId) => {
    setCheatingLog({
      noFaceCount: 0,
      multipleFaceCount: 0,
      cellPhoneCount: 0,
      prohibitedObjectCount: 0,
      examId,
      username: userInfo?.name || '',
      email: userInfo?.email || '',
      screenshots: [], // keep explicit
    });
  };

  return (
    <CheatingLogContext.Provider value={{ cheatingLog, updateCheatingLog, resetCheatingLog }}>
      {children}
    </CheatingLogContext.Provider>
  );
};

export const useCheatingLog = () => {
  const context = useContext(CheatingLogContext);
  if (!context) {
    throw new Error('useCheatingLog must be used within a CheatingLogProvider');
  }
  return context;
};
