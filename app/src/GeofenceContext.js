import React, { createContext, useState } from 'react';

const GeofenceContext = createContext();

export const GeofenceProvider = ({ children }) => {
  const [geo, setGeofenceContext] = useState(null);

  console.log('****** >>>>>>>>>>>>>>>>>>>>>> GeofenceProvider() geofence: ', geo);


  return (
    <GeofenceContext.Provider value={{ geo, setGeofenceContext }}>
      {children}
    </GeofenceContext.Provider>
  );
};

export default GeofenceContext;
