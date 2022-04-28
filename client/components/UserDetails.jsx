import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export default UserContext;

// export function useUser() {
//   return useContext(UserContext)
// }

// export function useUserUpdate() {
//   return useContext(UserUpdateContext)
// }

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(undefined)

//   async function getUserInfo(username) {
//     setUser( async (user) => user = await axios.get(`/getUser/${username}`))
//   }

//   return (
//     <UserContext.Provider value={user}>
//       <UserUpdateContext.Provider value={getUserInfo}>
//         {children}
//       </UserUpdateContext.Provider>
//     </UserContext.Provider>

//   )

// };
