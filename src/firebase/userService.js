// src/firebase/userService.js
import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Create a new user account with Firebase Auth and initialize Firestore document
export async function createUser(email, password, userData = {}) {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set display name if provided
    if (userData.displayName) {
      await updateProfile(user, { displayName: userData.displayName });
    }
    
    // Optional: Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email: user.email,
      displayName: userData.displayName || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'student', // Default role
      createdAt: serverTimestamp(),
      ...userData // Spread any additional fields passed
    });
    
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Create or update user document in Firestore
export async function createUserDocument(uid, userData = {}) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing document
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    }
    
    return userRef;
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

// Get user data from Firestore
export async function getUserData(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn("No user document found for uid:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

// Update user profile data
export async function updateUserProfile(uid, profileData) {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Handle display name updates in Auth as well
    if (profileData.displayName && auth.currentUser && uid === auth.currentUser.uid) {
      await updateProfile(auth.currentUser, { 
        displayName: profileData.displayName 
      });
    }
    
    // Update in Firestore
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Set or update user role (admin function)
export async function setUserRole(uid, role) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
}

// Add student-specific information
export async function updateStudentInfo(uid, studentInfo) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      studentInfo,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating student info:", error);
    throw error;
  }
}

// Add faculty-specific information 
export async function updateFacultyInfo(uid, facultyInfo) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      facultyInfo,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating faculty info:", error);
    throw error;
  }
}