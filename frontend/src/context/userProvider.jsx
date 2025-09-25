import React, { useState } from "react";
import { UserContext } from "./userContext";

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    }

    //funciton to clear user data (eg on logout)
    const clearUser = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider value={{user, updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;