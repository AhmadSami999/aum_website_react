// /src/hooks/useOdooUser.js - Updated to use Firebase Function
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Replace with your Firebase Function URL after deployment
const FIREBASE_FUNCTION_URL = 'https://us-central1-american-university-of-malta.cloudfunctions.net/odooProxy';

export function useOdooUser() {
  const { currentUser } = useAuth();
  const [odooUserInfo, setOdooUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callFirebaseFunction = async (action, additionalData = {}) => {
    try {
      console.log(`🔥 Calling Firebase function with action: ${action}`);
      
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`📡 Firebase function response:`, result);

      return result;
    } catch (error) {
      console.error('❌ Firebase function error:', error);
      throw error;
    }
  };

  const fetchOdooUserInfo = useCallback(async () => {
    if (!currentUser?.email) {
      setError('No user email available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting Odoo user info fetch for:', currentUser.email);

      // Step 1: Test connection
      const connectionTest = await callFirebaseFunction('test_connection');
      
      if (!connectionTest.success) {
        throw new Error(`Connection failed: ${connectionTest.message}`);
      }

      console.log('✅ Connection successful, UID:', connectionTest.uid);

      // Step 2: Get user info with email for student search
      const userInfoResult = await callFirebaseFunction('get_user_info', {
        email: currentUser.email
      });
      
      if (!userInfoResult.success) {
        throw new Error(`User info failed: ${userInfoResult.message}`);
      }

      // Combine the information
      const userDetails = userInfoResult.userDetails || {};

      const combinedInfo = {
        uid: connectionTest.uid,
        // Use the actual Odoo record ID (like "1" from your Postman result)
        odooId: userDetails.odooId || connectionTest.uid,
        name: userDetails.name || 'Unknown User',
        email: userDetails.email || currentUser.email,
        phone: userDetails.phone,
        
        // Format the student ID using the actual record ID
        registrationNumber: userDetails.odooId ? `AUM-${userDetails.odooId}` : `AUM-${connectionTest.uid}`,
        
        // Store raw data for debugging
        rawUserInfo: userDetails,
        rawConnectionTest: connectionTest,
        allIdFields: userDetails.allIdFields
      };

      console.log('✅ Combined Odoo user info:', combinedInfo);
      setOdooUserInfo(combinedInfo);

    } catch (err) {
      console.error('❌ Error fetching Odoo user info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchOdooUserInfo();
  }, [fetchOdooUserInfo]);

  // Effect to fetch user info when component mounts or user changes
  useEffect(() => {
    if (currentUser?.email) {
      fetchOdooUserInfo();
    } else {
      setOdooUserInfo(null);
      setError(null);
      setLoading(false);
    }
  }, [currentUser?.email, fetchOdooUserInfo]);

  return {
    odooUserInfo,
    loading,
    error,
    refetch
  };
}

// Hook for getting student academic data
export function useOdooStudentAcademics() {
  const { currentUser } = useAuth();
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAcademicData = useCallback(async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    setError(null);

    try {
      // Get partners (students)
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_partners'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setAcademicData({
          partners: result.partnerDetails || [],
          count: result.count || 0,
          lastUpdated: new Date().toISOString()
        });
      } else {
        throw new Error(result.message || 'Failed to get academic data');
      }

    } catch (err) {
      console.error('❌ Error fetching academic data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) {
      fetchAcademicData();
    }
  }, [currentUser?.email, fetchAcademicData]);

  return {
    academicData,
    loading,
    error,
    refetch: fetchAcademicData
  };
}