import React, { useState, useEffect } from 'react';
import './WhyLiveInMalta.css';

// Import the hero image
const maltaHeroImage = '/img/malta-hero.jpg';
const bgTwoImage = '/img/bg-2.jpg';

function WhyLiveInMalta() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tableOfContents = [
    { id: 'overview', title: 'About Malta' },
    { id: 'facts', title: 'Quick Facts' },
    { id: 'reasons', title: 'Why Study Here' },
    { id: 'attractions', title: 'Things to Do' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Icon Components
  const MapIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,4A5,5 0 0,1 17,9C17,13 12,19.88 12,19.88C12,19.88 7,13 7,9A5,5 0 0,1 12,4M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z"/>
    </svg>
  );

  const PeopleIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C12.42,14 16,15.79 16,18V20H0V18C0,15.79 3.58,14 8,14Z"/>
    </svg>
  );

  const LanguageIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
    </svg>
  );

  const MoneyIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
    </svg>
  );

  const BusinessIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H14V15H12V13H14V11H12V9H20V19M18,11H16V13H18V11M18,15H16V17H18V15Z"/>
    </svg>
  );

  const quickFacts = [
    {
      icon: <MapIcon />,
      title: "Capital City",
      description: "Valletta is a former European Capital of Culture & Europe's smallest capital city."
    },
    {
      icon: <PeopleIcon />,
      title: "Population",
      description: "536,740 (2024 est.)"
    },
    {
      icon: <LanguageIcon />,
      title: "Official Languages",
      description: "Maltese and English"
    },
    {
      icon: <MoneyIcon />,
      title: "Currency",
      description: "In 2008 the Euro became legal tender in Malta."
    },
    {
      icon: <MapIcon />,
      title: "Location",
      description: "100 NM south of Sicily (Italy) 300 NM east of Tunisia."
    },
    {
      icon: <PeopleIcon />,
      title: "Society",
      description: "Multicultural"
    },
    {
      icon: <MapIcon />,
      title: "Terrain",
      description: "Varied, dissected plains, beaches and coastal cliffs."
    },
    {
      icon: <ShieldIcon />,
      title: "Climate",
      description: "Mediterranean with hot summers and cool winters."
    }
  ];

  const studyReasons = [
    {
      icon: <MoneyIcon />,
      title: "Good Value for Money",
      description: "Compared to other European countries, Malta is one of the most affordable places to study and live in. Prices for accommodation food and socializing are reasonable. AUM students get special deals and discounts for museums, restaurants, gyms and can participate in numerous activities. The public transport system also offers special prices for our university students."
    },
    {
      icon: <ShieldIcon />,
      title: "Peaceful Country",
      description: "Malta is considered among the safest countries in the European Union. The Maltese people are very friendly, respectful and well-educated people. The crime rate on the island is among the lowest in Europe."
    },
    {
      icon: <BusinessIcon />,
      title: "A Business Hub",
      description: "Malta is strategically located in the Mediterranean with a long trading history as a way-point between East and West. As a result, Malta has become a place of choice for enterprises looking to expand their businesses worldwide."
    },
    {
      icon: <LanguageIcon />,
      title: "High-Quality American-Style Education",
      description: "Malta features a large influx of scholars from around the globe with the highest of standard. Thanks to its quality programs and the presence of international educational institutions, it's considered a great place to interact with other international students."
    }
  ];

  const attractions = [
    { name: "Blue Lagoon", description: "One of the most beautiful places in the Maltese islands, located at Comino." },
    { name: "Mdina", description: "Known as Città Vecchia, it is a fortified city which served as the island's first capital." },
    { name: "L-Għar tal-Mixta", description: "Visit the beautiful cave across from the red sands of Ramla l-Ħamra." },
    { name: "Popeye Village Malta", description: "Originally created as the film set of the 1980 musical production of Popeye." },
    { name: "Marsaxlokk", description: "This fishing village is the largest fishing harbor of Malta." },
    { name: "St John's Co Cathedral", description: "Is one of 365 churches and one of the top museums to see on the island." },
    { name: "Il Festa", description: "Every year, around 60 festas are held in Malta and 20 in Gozo." },
    { name: "Kalkara Marina", description: "Rent a boat from the harbor which is situated in picturesque Kalkara Creek." }
  ];

  return (
    <div className="malta-page">
      {/* Hero Banner with Background Image */}
      <section className="hero-banner" style={{ backgroundImage: `url(${maltaHeroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="program-title-box">Why Live & Study in Malta?</div>
          </div>
        </div>
      </section>

      {/* About Malta Section - First content section after hero */}
      <section id="overview" className="box-section section-white">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>About Malta</h2>
            </div>
            <div className="box-content">
              <p>
                Located in the center of the Mediterranean, between Europe and North Africa, Malta is the European Union's smallest member state. Famous for its 7,000-year old history and 300 days of sunshine per year. Malta has emerged as one of the most remarkable success stories in the Eurozone. Recognized for its pro-business attitude, state-of-the-art infrastructure and modest costs of doing business, it has become the go-to country for growth-minded entrepreneurs and multinational companies looking to base themselves in the Mediterranean.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts Section with Background Image */}
      <section className="facts-section" style={{ backgroundImage: `url(${bgTwoImage})` }}>
        <div className="facts-overlay"></div>
        <div className="facts-content">
          <div className="facts-inner">
            <h2 id="facts">WHY LIVE & STUDY IN MALTA?</h2>
            
            <div className="facts-grid">
              {quickFacts.map((fact, index) => (
                <div key={index} className="fact-card">
                  <div className="fact-icon">
                    {fact.icon}
                  </div>
                  <h3>{fact.title}</h3>
                  <p>{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Remaining Content Sections */}
      <section id="reasons" className="box-section section-grey">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>What makes Malta a Great Destination for Students?</h2>
            </div>
            <div className="box-content">
              <p>Malta has some truly unique features that make this destination one of the top choices for studying worldwide. Whether you're dreaming of an exciting adventure or finding somewhere friendly to study, we want to tell you some of the most important reasons why you should pick Malta.</p>
              
              <div className="resource-cards">
                {studyReasons.map((reason, index) => (
                  <div key={index} className="resource-card">
                    <div className="resource-icon">
                      {reason.icon}
                    </div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="attractions" className="box-section section-white">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>Fun Things to Do in Malta</h2>
            </div>
            <div className="box-content">
              <p>With 14 public holidays, you'll have more time to enjoy the beautiful island. From beach outings to island-wide cultural expeditions, Malta offers plenty of opportunities for you to have fun.</p>
              
              <div className="attractions-grid">
                {attractions.map((attraction, index) => (
                  <div key={index} className="attraction-card">
                    <h4>{attraction.name}</h4>
                    <p>{attraction.description}</p>
                  </div>
                ))}
              </div>

              <div className="history-banner">
                <h2>MORE THAN 7000 YEARS</h2>
                <h3>OF HISTORY TO EXPLORE</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhyLiveInMalta;