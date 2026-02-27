import { createContext, useContext, useState, useEffect } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query, ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    const checkUserStatus = async () => {
        if (userId) {
            // User ID exists in localStorage, try to fetch user data
            try {
                const response = await databases.getDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.usersCollectionId,
                    userId
                );
                setUser(response);
            } catch (error) {
                console.log('User not found, clearing session');
                setUser(null);
                setUserId(null);
                localStorage.removeItem('userId');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            // Query users collection to find matching email and password
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.usersCollectionId,
                [
                    Query.equal('email', email),
                    Query.equal('password', password)
                ]
            );

            if (response.documents.length === 0) {
                throw new Error('Invalid email or password');
            }

            const userData = response.documents[0];
            setUser(userData);
            setUserId(userData.$id);
            
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
        }
    };

    const signup = async (email, password, name) => {
        try {
            // Check if email already exists
            const checkResponse = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.usersCollectionId,
                [Query.equal('email', email)]
            );

            if (checkResponse.documents.length > 0) {
                throw new Error('Email already registered');
            }

            // Create new user in database
            const newUser = await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.usersCollectionId,
                ID.unique(),
                {
                    email: email,
                    password: password,
                    name: name || email.split('@')[0]
                }
            );

            // Auto-login after signup
            setUser(newUser);
            setUserId(newUser.$id);
            
            return newUser;
        } catch (error) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = async () => {
        setUser(null);
        setUserId(null);
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ user, userId, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);