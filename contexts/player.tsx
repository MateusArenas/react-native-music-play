import React from "react";

interface PlayerContextData {
    
}

const PlayerContext = React.createContext<PlayerContextData>({} as PlayerContextData)

export const PlayerProvider: React.FC = ({ children }) => {

  return (
    <PlayerContext.Provider value={{}} >
        {children}
    </PlayerContext.Provider>
  )
}

export default PlayerContext
