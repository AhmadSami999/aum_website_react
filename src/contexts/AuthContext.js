// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password, rememberMe = false) {
    try {
      // Set the persistence type based on rememberMe flag
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      
      // Set persistence first
      await setPersistence(auth, persistenceType);
      
      // Then perform sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Handle remember me for 30 days using localStorage
      if (rememberMe) {
        // Calculate expiry date (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Save session info in localStorage
        localStorage.setItem('authRememberMe', 'true');
        localStorage.setItem('authExpiryDate', expiryDate.toISOString());
      } else {
        // Clear any existing remember me data
        localStorage.removeItem('authRememberMe');
        localStorage.removeItem('authExpiryDate');
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    // Clear any remember me settings when logging out
    localStorage.removeItem('authRememberMe');
    localStorage.removeItem('authExpiryDate');
    return signOut(auth);
  }

  // Function to check if the remember me session has expired
  function checkSessionExpiry() {
    const rememberMe = localStorage.getItem('authRememberMe');
    const expiryDateStr = localStorage.getItem('authExpiryDate');
    
    if (rememberMe && expiryDateStr) {
      const expiryDate = new Date(expiryDateStr);
      const now = new Date();
      
      // If expired, clear the data and sign out
      if (now > expiryDate) {
        localStorage.removeItem('authRememberMe');
        localStorage.removeItem('authExpiryDate');
        signOut(auth);
        return false;
      }
      return true;
    }
    return false;
  }

  // Function to update user display name
  async function updateUserDisplayName(displayName) {
    if (!currentUser) return;
    
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, { displayName });
      
      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { displayName }, { merge: true });
      
      // Update local state
      setCurrentUser({ ...currentUser, displayName });
      
      return true;
    } catch (error) {
      console.error('Error updating display name:', error);
      return false;
    }
  }

  // Function to update user profile data in Firestore
  async function updateUserProfile(profileData) {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, profileData, { merge: true });
      
      // Update local state
      setUserProfile({ ...userProfile, ...profileData });
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  useEffect(() => {
    // Check for session expiry when the component mounts
    checkSessionExpiry();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          // If user doesn't exist in Firestore, create a new record
          if (!userSnap.exists()) {
            // Extract name parts if available
            let firstName = '';
            let lastName = '';
            if (user.displayName) {
              const nameParts = user.displayName.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
            
            // Set default user data with expanded model
            const userData = {
              // Basic user info
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              
              // Role and access
              role: 'student', // Default role
              permissions: [], // No special permissions by default
              
              // Profile information
              firstName: firstName,
              lastName: lastName,
              phoneNumber: user.phoneNumber || '',
              profileImageUrl: user.photoURL || '',
              
              // Student-specific information
              studentInfo: {
                enrollmentStatus: 'prospective', // Default status for new users
              },
              
              // Timestamps
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            
            await setDoc(userRef, userData);
            setRole('student');
            setUserProfile(userData);
          } else {
            // User exists, get their data
            const userData = userSnap.data();
            
            // Update last login time
            await setDoc(userRef, {
              lastLogin: new Date().toISOString()
            }, { merge: true });
            
            setRole(userData.role || 'student');
            setUserProfile(userData);
            
            // If user has a displayName in Firestore but not in Auth, update Auth
            if (userData.displayName && !user.displayName) {
              await updateProfile(user, { displayName: userData.displayName });
            }
          }
        } catch (error) {
          console.error('Error syncing user info with Firestore:', error);
          setRole(null);
          setUserProfile(null);
        }
      } else {
        setRole(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
    userProfile,
    loading,
    login,
    logout,
    updateUserDisplayName,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}