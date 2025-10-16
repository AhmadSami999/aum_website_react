import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './config';

// Programs (undergraduate & graduate)
export const fetchPrograms = async (type) => {
  try {
    const programsRef = collection(db, 'programs');
    const q = query(programsRef, where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
};

export const fetchProgramById = async (id) => {
  try {
    const programRef = doc(db, 'programs', id);
    const docSnap = await getDoc(programRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such program!');
    }
  } catch (error) {
    console.error("Error fetching program by ID:", error);
    throw error;
  }
};

export const fetchProgramBySlug = async (slug) => {
  try {
    // First, try to find by slug
    const programsRef = collection(db, 'programs');
    const q = query(programsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    // If no program found by slug, try to find by ID as fallback
    // This handles old URLs that might still use IDs
    try {
      const programRef = doc(db, 'programs', slug);
      const docSnap = await getDoc(programRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (idError) {
      // If ID lookup also fails, continue to the error below
    }
    
    throw new Error('No program found with that slug');
  } catch (error) {
    console.error("Error fetching program by slug:", error);
    throw error;
  }
};

export const addProgram = async (programData) => {
  try {
    return await addDoc(collection(db, 'programs'), programData);
  } catch (error) {
    console.error("Error adding program:", error);
    throw error;
  }
};

export const updateProgram = async (id, programData) => {
  try {
    const programRef = doc(db, 'programs', id);
    return await updateDoc(programRef, programData);
  } catch (error) {
    console.error("Error updating program:", error);
    throw error;
  }
};

export const deleteProgram = async (id) => {
  try {
    const programRef = doc(db, 'programs', id);
    return await deleteDoc(programRef);
  } catch (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
};

// Home page content
export const fetchHomeContent = async () => {
  try {
    const homeDocRef = doc(db, 'pages', 'home');
    const docSnap = await getDoc(homeDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      const defaultData = {
        hero: {
          title: "American University of Malta",
          subtitle: "Learn Today, Lead Tomorrow",
          videoUrl: ""
        },
        welcome: {
          greeting: "Welcome to the",
          name: "American University of Malta",
          text1: "We embrace the dynamic American-style education, enriched by a vibrant European setting and a diverse, multicultural student body.",
          text2: "This fusion creates the ideal environment, enhancing your learning experience with unique global perspectives."
        }
      };
      try {
        await setDoc(homeDocRef, defaultData);
        console.log("Created default home page content");
      } catch (createError) {
        console.error("Error creating default home content:", createError);
      }
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching home content:", error);
    return {
      hero: {
        title: "American University of Malta",
        subtitle: "Learn Today, Lead Tomorrow",
        videoUrl: ""
      },
      welcome: {
        greeting: "Welcome to the",
        name: "American University of Malta",
        text1: "We embrace the dynamic American-style education, enriched by a vibrant European setting and a diverse, multicultural student body.",
        text2: "This fusion creates the ideal environment, enhancing your learning experience with unique global perspectives."
      }
    };
  }
};

export const updateHomeContent = async (contentData) => {
  try {
    const homeDocRef = doc(db, 'pages', 'home');
    return await setDoc(homeDocRef, contentData);
  } catch (error) {
    console.error("Error updating home content:", error);
    throw error;
  }
};

// Our University page content - UPDATED
export const fetchOurUniversityContent = async () => {
  try {
    const uniDocRef = doc(db, 'pages', 'ourUniversity');
    const docSnap = await getDoc(uniDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No Our University content found - creating default");
      // Create default content if nothing exists
      const defaultContent = {
        headerTitle: "Our University",
        welcome: {
          boldText: "Welcome to Our University",
          text: "We are dedicated to providing quality education in a global context."
        },
        missionInfo: {
          text: "Our mission is to educate the next generation of leaders.",
          buttonText: "Learn More"
        },
        visitInfo: {
          text: "We welcome visitors to our campus."
        },
        campus: {
          text1: "Our campus is located in a beautiful setting.",
          text2: "Visit us to experience our facilities firsthand.",
          buttonText: "Contact Us"
        }
      };
      
      try {
        await setDoc(uniDocRef, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default Our University content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error("Error fetching Our University content:", error);
    return {
      headerTitle: "Our University",
      welcome: {
        boldText: "Welcome to Our University",
        text: "We are dedicated to providing quality education in a global context."
      },
      missionInfo: {
        text: "Our mission is to educate the next generation of leaders.",
        buttonText: "Learn More"
      },
      visitInfo: {
        text: "We welcome visitors to our campus."
      },
      campus: {
        text1: "Our campus is located in a beautiful setting.",
        text2: "Visit us to experience our facilities firsthand.",
        buttonText: "Contact Us"
      }
    };
  }
};

export const updateOurUniversityContent = async (contentData) => {
  try {
    const uniDocRef = doc(db, 'pages', 'ourUniversity');
    return await setDoc(uniDocRef, contentData);
  } catch (error) {
    console.error("Error updating Our University content:", error);
    throw error;
  }
};

// Events
export const fetchEvents = async () => {
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const fetchEventById = async (id) => {
  try {
    const eventRef = doc(db, 'events', id);
    const docSnap = await getDoc(eventRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such event!');
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

export const addEvent = async (eventData) => {
  try {
    return await addDoc(collection(db, 'events'), eventData);
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const eventRef = doc(db, 'events', id);
    return await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const eventRef = doc(db, 'events', id);
    return await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// News
export const fetchNews = async () => {
  try {
    const newsRef = collection(db, 'news');
    const snapshot = await getDocs(newsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const fetchNewsById = async (id) => {
  try {
    const newsRef = doc(db, 'news', id);
    const docSnap = await getDoc(newsRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such news item!');
    }
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
};

export const addNews = async (newsData) => {
  try {
    return await addDoc(collection(db, 'news'), newsData);
  } catch (error) {
    console.error("Error adding news:", error);
    throw error;
  }
};

export const updateNews = async (id, newsData) => {
  try {
    const newsRef = doc(db, 'news', id);
    return await updateDoc(newsRef, newsData);
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

export const deleteNews = async (id) => {
  try {
    const newsRef = doc(db, 'news', id);
    return await deleteDoc(newsRef);
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

// Faculty and Staff Page - UPDATED
export const fetchFacultyAndStaffContent = async () => {
  try {
    const docRef = doc(db, 'pages', 'facultyAndStaff');
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.log("No Faculty and Staff content found - creating default");
      // Create default content if nothing exists
      const defaultContent = {
        headerTitle: "Faculty & Staff",
        introText: "Meet our distinguished faculty and staff members.",
        provost: {
          name: "Dr. Jane Smith",
          bio: "Our provost has over 20 years of experience in higher education.",
          imageUrl: ""
        }
      };
      
      try {
        await setDoc(docRef, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default Faculty and Staff content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error('Error fetching faculty and staff content:', error);
    return {
      headerTitle: "Faculty & Staff",
      introText: "Meet our distinguished faculty and staff members.",
      provost: {
        name: "Dr. Jane Smith",
        bio: "Our provost has over 20 years of experience in higher education.",
        imageUrl: ""
      }
    };
  }
};

export const updateFacultyAndStaffContent = async (data) => {
  try {
    const docRef = doc(db, 'pages', 'facultyAndStaff');
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error updating faculty and staff content:', error);
    throw error;
  }
};

// Board of Trustees Page (new)
export const fetchBoardOfTrusteesContent = async () => {
  try {
    const docRef = doc(db, 'pages', 'boardOfTrustees');
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.log("No Board of Trustees content found - creating default");
      // Create default content if nothing exists
      const defaultContent = {
        headerTitle: "Board of Trustees",
        introText: "Our board of trustees guides the strategic direction of the university.",
        members: [
          {
            name: "John Doe",
            title: "Chairperson",
            bio: "John has served on our board for 10 years.",
            imageUrl: ""
          }
        ]
      };
      
      try {
        await setDoc(docRef, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default Board of Trustees content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error('Error fetching Board of Trustees content:', error);
    return {
      headerTitle: "Board of Trustees",
      introText: "Our board of trustees guides the strategic direction of the university.",
      members: []
    };
  }
};

export const updateBoardOfTrusteesContent = async (contentData) => {
  try {
    const docRef = doc(db, 'pages', 'boardOfTrustees');
    return await setDoc(docRef, contentData);
  } catch (error) {
    console.error("Error updating Board of Trustees content:", error);
    throw error;
  }
};

// Faculty Members
export const fetchFacultyMembers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'facultyMembers'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching faculty members:', err);
    return [];
  }
};

export const addFacultyMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, 'facultyMembers'), memberData);
    return docRef.id;
  } catch (err) {
    console.error('Error adding faculty member:', err);
    throw err;
  }
};

export const updateFacultyMember = async (id, memberData) => {
  try {
    const docRef = doc(db, 'facultyMembers', id);
    await updateDoc(docRef, memberData);
  } catch (err) {
    console.error('Error updating faculty member:', err);
    throw err;
  }
};

export const deleteFacultyMember = async (id) => {
  try {
    const docRef = doc(db, 'facultyMembers', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting faculty member:', err);
    throw err;
  }
};

// 🔔 Notifications
export const createNotification = async (title, message, recipients) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const notificationDoc = await addDoc(notificationsRef, {
      title,
      message,
      recipients,
      createdAt: serverTimestamp()
    });
    return notificationDoc.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const assignNotificationToUsers = async (notificationId, userList) => {
  try {
    for (const user of userList) {
      const userNotifRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await setDoc(userNotifRef, {
        notificationId,
        read: false,
        assignedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error assigning notification to users:', error);
    throw error;
  }
};

export const fetchUserNotifications = async (uid) => {
  try {
    const notifRef = collection(db, 'users', uid, 'notifications');
    const snapshot = await getDocs(notifRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (uid, notificationId) => {
  try {
    const ref = doc(db, 'users', uid, 'notifications', notificationId);
    await updateDoc(ref, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const fetchAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUserRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const addUser = async ({ email, role, firstName, lastName, password }) => {
  const response = await fetch('https://us-central1-american-university-of-malta.cloudfunctions.net/createUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role, firstName, lastName, password })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create user');
  }

  return await response.json();
};

export const deleteUser = async (uid) => {
  await fetch('https://us-central1-american-university-of-malta.cloudfunctions.net/deleteUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid })
  });
};

// Undergraduate Page Content
export const fetchUndergraduateContent = async () => {
  try {
    const undergradeDocRef = doc(db, 'pages', 'undergraduate');
    const docSnap = await getDoc(undergradeDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No Undergraduate content found - creating default");
      // Create default content if nothing exists
      const defaultContent = {
        headerTitle: "Undergraduate Programs",
        introText: "Explore our undergraduate degree programs."
      };
      
      try {
        await setDoc(undergradeDocRef, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default Undergraduate content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error("Error fetching Undergraduate content:", error);
    return {
      headerTitle: "Undergraduate Programs",
      introText: "Explore our undergraduate degree programs."
    };
  }
};

export const updateUndergraduateContent = async (contentData) => {
  try {
    const undergradeDocRef = doc(db, 'pages', 'undergraduate');
    return await setDoc(undergradeDocRef, contentData);
  } catch (error) {
    console.error("Error updating Undergraduate content:", error);
    throw error;
  }
};

export const fetchGraduateContent = async () => {
  try {
    const ref = doc(db, 'pages', 'graduate');
    const snap = await getDoc(ref);
    
    if (snap.exists()) {
      return snap.data();
    } else {
      console.log("No Graduate content found - creating default");
      // Create default content
      const defaultContent = {
        headerTitle: "Graduate Programs",
        introText: "Explore our graduate degree programs."
      };
      
      try {
        await setDoc(ref, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default Graduate content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error("Error fetching Graduate content:", error);
    return {
      headerTitle: "Graduate Programs",
      introText: "Explore our graduate degree programs."
    };
  }
};

export const updateGraduateContent = async (data) => {
  try {
    return await setDoc(doc(db, 'pages', 'graduate'), data, { merge: true });
  } catch (error) {
    console.error("Error updating Graduate content:", error);
    throw error;
  }
};

// Quality Assurance Page Content
export const fetchQualityAssuranceContent = async () => {
  try {
    const qaDocRef = doc(db, 'pages', 'qualityAssurance');
    const docSnap = await getDoc(qaDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No Quality Assurance content found - creating default");
      const defaultContent = {
        pageTitle: 'Quality Assurance',
        intro: {
          heading: 'Our Commitment to Quality',
          text: ''
        },
        approval: {
          heading: 'University Approval',
          text: '',
          imageUrl: ''
        },
        qualification: {
          heading: 'Qualification Framework',
          text: '',
          imageUrl: ''
        },
        metaTitle: '',
        metaDescription: ''
      };
      
      try {
        await setDoc(qaDocRef, defaultContent);
        return defaultContent;
      } catch (error) {
        console.error("Error creating default QA content:", error);
        return defaultContent;
      }
    }
  } catch (error) {
    console.error("Error fetching QA content:", error);
    return {
      pageTitle: 'Quality Assurance',
      intro: { heading: 'Our Commitment to Quality', text: '' },
      approval: { heading: 'University Approval', text: '', imageUrl: '' },
      qualification: { heading: 'Qualification Framework', text: '', imageUrl: '' },
      metaTitle: '',
      metaDescription: ''
    };
  }
};

export const updateQualityAssuranceContent = async (contentData) => {
  try {
    const qaDocRef = doc(db, 'pages', 'qualityAssurance');
    return await setDoc(qaDocRef, contentData);
  } catch (error) {
    console.error("Error updating QA content:", error);
    throw error;
  }
};

// Navbar Configuration Management
export const fetchNavbarConfig = async () => {
  try {
    const navbarDocRef = doc(db, 'settings', 'navbar');
    const docSnap = await getDoc(navbarDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No navbar config found - creating default");
      // Create default navbar configuration with mega menus
      const defaultConfig = {
        items: [
          {
            id: 'undergraduate',
            title: 'Undergraduate',
            type: 'megamenu',
            visible: true,
            order: 1,
            megaMenuColumns: [
              {
                id: 'undergrad-programs',
                title: 'Programs',
                order: 1,
                items: [
                  { title: 'All Undergraduate Programs', url: '/undergraduate', isExternal: false }
                ]
              },
              {
                id: 'undergrad-resources',
                title: 'Resources',
                order: 2,
                items: [
                  { title: 'Academic Calendar', url: '/academic-calendar', isExternal: false },
                  { title: 'Course Catalog', url: '/catalog', isExternal: false }
                ]
              }
            ]
          },
          {
            id: 'graduate',
            title: 'Graduate',
            type: 'megamenu',
            visible: true,
            order: 2,
            megaMenuColumns: [
              {
                id: 'grad-programs',
                title: 'Programs',
                order: 1,
                items: [
                  { title: 'All Graduate Programs', url: '/graduate', isExternal: false }
                ]
              },
              {
                id: 'grad-resources',
                title: 'Resources',
                order: 2,
                items: [
                  { title: 'Graduate Admissions', url: '/graduate-admissions', isExternal: false },
                  { title: 'Research Opportunities', url: '/research', isExternal: false }
                ]
              }
            ]
          },
          {
            id: 'about',
            title: 'About',
            type: 'megamenu',
            visible: true,
            order: 3,
            megaMenuColumns: [
              {
                id: 'about-university',
                title: 'University',
                order: 1,
                items: [
                  { title: 'Our University', url: '/our-university', isExternal: false },
                  { title: 'Mission & Vision', url: '/mission', isExternal: false }
                ]
              },
              {
                id: 'about-people',
                title: 'People',
                order: 2,
                items: [
                  { title: 'Faculty and Staff Directory', url: '/faculty-and-staff', isExternal: false },
                  { title: 'Board of Trustees', url: '/board-of-trustees', isExternal: false }
                ]
              },
              {
                id: 'about-info',
                title: 'Information',
                order: 3,
                items: [
                  { title: 'Tuition Fees', url: '/tuition-fees', isExternal: false },
                  { title: 'Contact Us', url: '/contact', isExternal: false }
                ]
              }
            ]
          },
          {
            id: 'student-life',
            title: 'Student Life',
            type: 'link',
            url: '/student-life',
            isExternal: false,
            visible: true,
            order: 4
          },
          {
            id: 'apply-now',
            title: 'APPLY NOW',
            type: 'button',
            url: 'https://apply.aum.edu.mt',
            isExternal: true,
            visible: true,
            order: 5
          }
        ],
        lastModified: serverTimestamp()
      };
      
      try {
        await setDoc(navbarDocRef, defaultConfig);
        return defaultConfig;
      } catch (error) {
        console.error("Error creating default navbar config:", error);
        return defaultConfig;
      }
    }
  } catch (error) {
    console.error("Error fetching navbar config:", error);
    return {
      items: [],
      lastModified: null
    };
  }
};

export const updateNavbarConfig = async (configData) => {
  try {
    const navbarDocRef = doc(db, 'settings', 'navbar');
    const updateData = {
      ...configData,
      lastModified: serverTimestamp()
    };
    return await setDoc(navbarDocRef, updateData);
  } catch (error) {
    console.error("Error updating navbar config:", error);
    throw error;
  }
};

// Helper function to generate slug from title (fallback for programs without slugs)
const generateSlugFromTitle = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Helper function to get navbar items with programs integrated into mega menus
export const getNavbarItemsWithPrograms = async () => {
  try {
    const navbarConfig = await fetchNavbarConfig();
    const undergradPrograms = await fetchPrograms('undergraduate');
    const graduatePrograms = await fetchPrograms('graduate');
    
    // Filter visible programs that are not hidden from navbar
    const visibleUndergrad = undergradPrograms.filter(program => !program.hideFromNavbar);
    const visibleGraduate = graduatePrograms.filter(program => !program.hideFromNavbar);
    
    // Update navbar items with current programs
    const updatedItems = navbarConfig.items.map(item => {
      if (item.id === 'undergraduate' && item.type === 'megamenu') {
        // Find the programs column or create one
        const updatedColumns = item.megaMenuColumns.map(column => {
          if (column.id === 'undergrad-programs' || column.title === 'Programs') {
            // Keep static items that don't start with /program/
            const staticItems = column.items.filter(item => 
              !item.url.startsWith('/program/')
            );
            // Add dynamic program items with slugs
            const programItems = visibleUndergrad.map(program => ({
              title: program.title,
              url: `/program/${program.slug || generateSlugFromTitle(program.title)}`,
              isExternal: false
            }));
            return {
              ...column,
              items: [...staticItems, ...programItems]
            };
          }
          return column;
        });
        
        return {
          ...item,
          megaMenuColumns: updatedColumns
        };
      }
      
      if (item.id === 'graduate' && item.type === 'megamenu') {
        const updatedColumns = item.megaMenuColumns.map(column => {
          if (column.id === 'grad-programs' || column.title === 'Programs') {
            const staticItems = column.items.filter(item => 
              !item.url.startsWith('/program/')
            );
            // Add dynamic program items with slugs
            const programItems = visibleGraduate.map(program => ({
              title: program.title,
              url: `/program/${program.slug || generateSlugFromTitle(program.title)}`,
              isExternal: false
            }));
            return {
              ...column,
              items: [...staticItems, ...programItems]
            };
          }
          return column;
        });
        
        return {
          ...item,
          megaMenuColumns: updatedColumns
        };
      }
      
      return item;
    });
    
    return {
      ...navbarConfig,
      items: updatedItems
    };
  } catch (error) {
    console.error("Error getting navbar items with programs:", error);
    return { items: [] };
  }
};

// Quality Assurance Functions - Add these to your firestore.js

// Fetch all QA topics with hierarchical structure
export const fetchQATopics = async () => {
  try {
    const qaRef = collection(db, 'qaTopics');
    const snapshot = await getDocs(qaRef);
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Organize into hierarchical structure
    const mainTopics = topics.filter(topic => topic.isMainTopic || !topic.parentId);
    const subTopics = topics.filter(topic => !topic.isMainTopic && topic.parentId);
    
    // Attach children to their parents
    const organizedTopics = mainTopics.map(mainTopic => ({
      ...mainTopic,
      children: subTopics
        .filter(subTopic => subTopic.parentId === mainTopic.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    }));
    
    // Sort main topics by order
    return organizedTopics.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching QA topics:", error);
    return [];
  }
};

// Add a new QA topic
export const addQATopic = async (topicData) => {
  try {
    const qaRef = collection(db, 'qaTopics');
    const docRef = await addDoc(qaRef, {
      ...topicData,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding QA topic:", error);
    throw error;
  }
};

// Update an existing QA topic
export const updateQATopic = async (topicId, topicData) => {
  try {
    const topicRef = doc(db, 'qaTopics', topicId);
    await updateDoc(topicRef, {
      ...topicData,
      lastModified: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating QA topic:", error);
    throw error;
  }
};

// Delete a QA topic
export const deleteQATopic = async (topicId) => {
  try {
    // First, delete any subtopics that belong to this topic
    const qaRef = collection(db, 'qaTopics');
    const q = query(qaRef, where('parentId', '==', topicId));
    const subTopicsSnapshot = await getDocs(q);
    
    // Delete all subtopics first
    const deletePromises = subTopicsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);
    
    // Then delete the main topic
    const topicRef = doc(db, 'qaTopics', topicId);
    await deleteDoc(topicRef);
  } catch (error) {
    console.error("Error deleting QA topic:", error);
    throw error;
  }
};

// Update the order of QA topics (for drag-and-drop functionality)
export const updateQATopicsOrder = async (topics) => {
  try {
    const batch = [];
    
    // Update main topics order
    topics.forEach((topic, index) => {
      const topicRef = doc(db, 'qaTopics', topic.id);
      batch.push(
        updateDoc(topicRef, {
          order: index + 1,
          lastModified: serverTimestamp()
        })
      );
      
      // Update subtopics order
      if (topic.children && topic.children.length > 0) {
        topic.children.forEach((subTopic, subIndex) => {
          const subTopicRef = doc(db, 'qaTopics', subTopic.id);
          batch.push(
            updateDoc(subTopicRef, {
              order: subIndex + 1,
              lastModified: serverTimestamp()
            })
          );
        });
      }
    });
    
    // Execute all updates
    await Promise.all(batch);
  } catch (error) {
    console.error("Error updating QA topics order:", error);
    throw error;
  }
};

// Get QA topic by ID
export const getQATopicById = async (topicId) => {
  try {
    const topicRef = doc(db, 'qaTopics', topicId);
    const docSnap = await getDoc(topicRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('QA topic not found');
    }
  } catch (error) {
    console.error("Error fetching QA topic by ID:", error);
    throw error;
  }
};