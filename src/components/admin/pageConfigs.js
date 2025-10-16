// Page configuration for the unified PageEditor
export const pageConfigs = {
  home: {
    title: 'Home Page',
    collection: 'pages',
    documentId: 'home',
    viewPath: '/',
    sections: [
      {
        title: 'Hero Section',
        fields: [
          { name: 'hero.title', label: 'Hero Title', type: 'text', required: true },
          { name: 'hero.subtitle', label: 'Hero Subtitle', type: 'text', required: true },
          { name: 'hero.videoUrl', label: 'Video URL', type: 'text' }
        ]
      },
      {
        title: 'Welcome Section',
        fields: [
          { name: 'welcome.greeting', label: 'Greeting', type: 'text', required: true },
          { name: 'welcome.name', label: 'University Name', type: 'text', required: true },
          { name: 'welcome.text1', label: 'Welcome Text (Paragraph 1)', type: 'richtext', placeholder: 'Enter welcome text paragraph 1...' },
          { name: 'welcome.text2', label: 'Welcome Text (Paragraph 2)', type: 'richtext', placeholder: 'Enter welcome text paragraph 2...' }
        ]
      },
      {
        title: 'Icon Section Background',
        fields: [
          { name: 'iconBackground.url', label: 'Background Image', type: 'image', folder: 'programs/home' }
        ]
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
      hero: {
        title: "American University of Malta",
        subtitle: "Learn Today, Lead Tomorrow",
        videoUrl: ""
      },
      welcome: {
        greeting: "Welcome to the",
        name: "American University of Malta",
        text1: "We embrace the dynamic American-style education, enriched by a vibrant European setting.",
        text2: "This fusion creates a unique learning experience with global perspectives."
      },
      iconBackground: {
        url: ""
      },
      metaTitle: '',
      metaDescription: ''
    }
  },
  
  undergraduate: {
    title: 'Undergraduate Page',
    collection: 'pages',
    documentId: 'undergraduate',
    viewPath: '/undergraduate',
    sections: [
      {
        title: 'Page Header',
        fields: [
          { name: 'pageHeaderTitle', label: 'Title', type: 'text', required: true }
        ]
      },
      {
        title: 'Intro Section (Blue Box)',
        fields: [
          { name: 'intro.p1', label: 'Paragraph 1', type: 'richtext', placeholder: 'Enter paragraph 1 content...' },
          { name: 'intro.p2', label: 'Paragraph 2', type: 'richtext', placeholder: 'Enter paragraph 2 content...' },
          { name: 'intro.p3', label: 'Paragraph 3', type: 'richtext', placeholder: 'Enter paragraph 3 content...' }
        ]
      },
      {
        title: 'Student Visa Section',
        fields: [
          { name: 'visaSection.heading', label: 'Heading', type: 'text' },
          { name: 'visaSection.p1', label: 'Paragraph 1', type: 'richtext', placeholder: 'Enter paragraph 1 content...' },
          { name: 'visaSection.p2', label: 'Paragraph 2', type: 'richtext', placeholder: 'Enter paragraph 2 content...' },
          { name: 'visaSection.ctaLabel', label: 'CTA Button 1 Label', type: 'text' },
          { name: 'visaSection.ctaUrl', label: 'CTA Button 1 URL', type: 'text' },
          { name: 'visaSection.ctaLabel2', label: 'CTA Button 2 Label (Optional)', type: 'text', placeholder: 'Leave empty to hide second button' },
          { name: 'visaSection.ctaUrl2', label: 'CTA Button 2 URL', type: 'text' },
          { name: 'visaSection.imageUrl', label: 'Visa Image', type: 'image', folder: 'programs/undergraduate' }
        ]
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
      pageHeaderTitle: 'Our Study Programs',
      intro: {
        p1: 'Start your journey at AUM.',
        p2: 'Explore our academic areas, discover hands‑on learning opportunities, and see how AUM prepares you for a global career.',
        p3: ''
      },
      visaSection: {
        heading: 'Student Visa Requirements',
        p1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        p2: 'Morbi cursus, justo quis viverra dictum, urna massa tempus magna.',
        ctaLabel: 'Start Your Application',
        ctaUrl: '/apply',
        ctaLabel2: 'Learn More',
        ctaUrl2: '/student-visa',
        imageUrl: ''
      },
      metaTitle: '',
      metaDescription: ''
    }
  },

  ourUniversity: {
    title: 'Our University Page',
    collection: 'pages',
    documentId: 'ourUniversity',
    viewPath: '/our-university',
    sections: [
      {
        title: 'Header',
        fields: [
          { name: 'headerTitle', label: 'Page Title', type: 'text', required: true }
        ]
      },
      {
        title: 'Welcome Section',
        fields: [
          { name: 'welcome.boldText', label: 'Bold Text', type: 'text' },
          { name: 'welcome.text', label: 'Main Text', type: 'richtext', placeholder: 'Enter main welcome text...' }
        ]
      },
      {
        title: 'Mission Information',
        fields: [
          { name: 'missionInfo.text', label: 'Mission Text', type: 'richtext', placeholder: 'Enter mission text...' },
          { name: 'missionInfo.buttonText', label: 'Button Text', type: 'text' }
        ]
      },
      {
        title: 'Visit Information',
        fields: [
          { name: 'visitInfo.text', label: 'Visit Text', type: 'richtext', placeholder: 'Enter visit information...' }
        ]
      },
      {
        title: 'Campus Information',
        fields: [
          { name: 'campus.text1', label: 'Campus Text 1', type: 'richtext', placeholder: 'Enter campus text 1...' },
          { name: 'campus.text2', label: 'Campus Text 2', type: 'richtext', placeholder: 'Enter campus text 2...' },
          { name: 'campus.buttonText', label: 'Button Text', type: 'text' }
        ]
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
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
      },
      metaTitle: '',
      metaDescription: ''
    }
  },

  facultyAndStaff: {
    title: 'Faculty And Staff Page',
    collection: 'pages',
    documentId: 'facultyAndStaff',
    viewPath: '/faculty-and-staff',
    sections: [
      {
        title: 'Page Content',
        fields: [
          { name: 'title', label: 'Page Title', type: 'text', required: true },
          { name: 'subtitle', label: 'Subtitle', type: 'text' },
          { name: 'description', label: 'Description', type: 'richtext' }
        ]
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
      title: 'Faculty & Staff',
      subtitle: 'Meet our dedicated team',
      description: '',
      metaTitle: '',
      metaDescription: ''
    }
  },

  tuitionFees: {
    title: 'Tuition Fees Page',
    collection: 'settings',
    documentId: 'tuitionFees',
    viewPath: '/tuition-fees',
    sections: [
      {
        title: 'Page Header',
        fields: [
          { name: 'title', label: 'Page Title', type: 'text', required: true },
          { name: 'subtitle', label: 'Subtitle', type: 'text' }
        ]
      },
      {
        title: 'Tuition Cards',
        type: 'repeater',
        name: 'cards',
        fields: [
          { name: 'heading', label: 'Heading', type: 'text', required: true },
          { name: 'tuition', label: 'Tuition Amount', type: 'text', required: true },
          { name: 'admission', label: 'Admission Fee', type: 'text' },
          { name: 'description', label: 'Description', type: 'richtext', placeholder: 'Enter description...' },
          { name: 'programs', label: 'Programs Covered', type: 'text' }
        ],
        addButtonText: 'Add Tuition Card',
        defaultItem: {
          heading: 'New Tuition Group',
          tuition: '',
          admission: '',
          description: '',
          programs: ''
        }
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
      title: 'Tuition Fees',
      subtitle: 'Per Semester',
      metaTitle: '',
      metaDescription: '',
      cards: [
        {
          id: 'undergrad',
          heading: 'Undergraduate Programs',
          tuition: '€4,150',
          admission: '+ €1,000 Admission Fee',
          description: 'Tuition fees are paid per semester. Admission fee is a one-time payment.',
          programs: 'All Arts, Business & Data Sciences Bachelors Programs',
        },
        {
          id: 'undergrad-eng',
          heading: 'Undergraduate Engineering',
          tuition: '€5,150',
          admission: '+ €1,000 Admission Fee',
          description: 'Tuition fees are paid per semester. Admission fee is a one-time payment.',
          programs: 'All Bachelors Engineering Programs',
        },
        {
          id: 'grad',
          heading: 'Graduate Programs',
          tuition: '€6,250',
          admission: '+ €1,000 Admission Fee',
          description: 'Tuition fees are paid per semester. Admission fee is a one-time payment.',
          programs: 'All Master\'s Programs',
        }
      ]
    }
  },

  qualityAssurance: {
    title: 'Quality Assurance Page',
    collection: 'pages',
    documentId: 'qualityAssurance',
    viewPath: '/quality-assurance',
    sections: [
      {
        title: 'Page Header',
        fields: [
          { name: 'pageTitle', label: 'Page Title', type: 'text', required: true }
        ]
      },
      {
        title: 'Introduction',
        fields: [
          { name: 'intro.heading', label: 'Heading', type: 'text' },
          { name: 'intro.text', label: 'Text', type: 'richtext' }
        ]
      },
      {
        title: 'Approval Section',
        fields: [
          { name: 'approval.heading', label: 'Heading', type: 'text' },
          { name: 'approval.text', label: 'Text', type: 'richtext' },
          { name: 'approval.imageUrl', label: 'Image', type: 'image', folder: 'quality-assurance' }
        ]
      },
      {
        title: 'Qualification Section',
        fields: [
          { name: 'qualification.heading', label: 'Heading', type: 'text' },
          { name: 'qualification.text', label: 'Text', type: 'richtext' },
          { name: 'qualification.imageUrl', label: 'Image', type: 'image', folder: 'quality-assurance' }
        ]
      },
      {
        title: 'SEO Metadata',
        fields: [
          { name: 'metaTitle', label: 'Meta Title', type: 'text' },
          { name: 'metaDescription', label: 'Meta Description', type: 'textarea', rows: 2 }
        ]
      }
    ],
    defaultContent: {
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
    }
  }
};

// Helper function to get page config by ID
export const getPageConfig = (pageId) => {
  return pageConfigs[pageId] || null;
};

// Helper function to get all page IDs
export const getAllPageIds = () => {
  return Object.keys(pageConfigs);
};