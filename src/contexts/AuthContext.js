import React, { useContext, useState, useEffect } from 'react';
import { auth} from '../firebase';
import { writeUserData } from '../firebase';
import { serverTimestamp, ref, update } from 'firebase/database';

import { database } from '../firebase';
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    async function signup(email, name, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            const userId = userCredential.user.uid;
            const userEmail = email;
            const username = name;
            const userRegTime = serverTimestamp();
            const status = 'active';
            writeUserData(userId, userEmail, username, userRegTime, status);
            return userCredential;
        } catch (error) {
            throw error;
        }
        
    }

    async function login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const userId = userCredential.user.uid;
            const lastLoginTime = serverTimestamp();
            updatelastLoginTime(userId, lastLoginTime);
            return userCredential;
        } catch (error) {
            throw error;
        }
    }

    function updatelastLoginTime(userId, lastLoginTime) {
        const userRef = ref(database, `database/users/${userId}`);
        update(userRef, {
            lastLoginTime: lastLoginTime,
        });
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);


    const value = {
        currentUser,
        login,
        signup,
        logout
    };

    return (
    <AuthContext.Provider value ={value}>
        {!loading && children}
    </AuthContext.Provider>
    ) 
};