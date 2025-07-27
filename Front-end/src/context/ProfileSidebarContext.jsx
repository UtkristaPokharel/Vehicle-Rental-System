import React, { createContext, useContext, useState } from 'react';

const ProfileSidebarContext = createContext();

export const ProfileSidebarProvider = ({ children }) => {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const openProfileSidebar = () => {
    setIsProfileSidebarOpen(true);
  };

  const closeProfileSidebar = () => {
    setIsProfileSidebarOpen(false);
  };

  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
  };

  return (
    <ProfileSidebarContext.Provider value={{
      isProfileSidebarOpen,
      openProfileSidebar,
      closeProfileSidebar,
      toggleProfileSidebar
    }}>
      {children}
    </ProfileSidebarContext.Provider>
  );
};

export const useProfileSidebar = () => {
  const context = useContext(ProfileSidebarContext);
  if (context === undefined) {
    throw new Error('useProfileSidebar must be used within a ProfileSidebarProvider');
  }
  return context;
};

export default ProfileSidebarContext;
