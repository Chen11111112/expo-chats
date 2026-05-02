import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('shadow_dev_2026');

  return (
    <UserContext.Provider value={{ userImage, setUserImage, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);