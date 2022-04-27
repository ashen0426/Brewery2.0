import { createContext, useContext, useState } from 'react';

const UserContext = createContext();
const UserUpdateContext = createContext();

export function useUser() {
  return useContext(UserContext)
}

export function useUserUpdate() {
  return useContext(UserUpdateContext)
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined)

  async function getUserInfo() {
      setUser(user => {
        user = await 
    })
  }
};
