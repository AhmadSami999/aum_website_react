// src/components/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css';
import { fetchHomeContent, fetchEvents, fetchNews } from '../firebase/firestore';
import heroVideoDefault from '../assets/hero.mp4';
import icon1 from '../assets/1.webp';
import icon1Hover from '../assets/1-h.webp';
import icon2 from '../assets/2.webp';
import icon2Hover from '../assets/2-h.webp';
import icon3 from '../assets/3.webp';
import icon3Hover from '../assets/3-h.webp';
import icon4 from '../assets/4.webp';
import icon4Hover from '../assets/4-h.webp';
import bg1 from '../assets/bg-1.webp';
import downArrow from '../assets/down-arrow.png';
import { FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useHomeContext } from '../contexts/HomeContext';

function Home() {
  const { homeBackground } = useHomeContext();

  const [content, setContent] = useState({
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
    },
    iconBackground: { url: "" },
    metaTitle: '',
    metaDescription: ''
  });

  const [loadingContent, setLoadingContent] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    async function getContent() {
      try {
        const homeData = await fetchHomeContent();
        if (homeData) {
          setContent(prev => ({
            ...prev,
            ...homeData,
            hero: { ...prev.hero, ...(homeData.hero || {}) },
            welcome: { ...prev.welcome, ...(homeData.welcome || {}) },
            iconBackground: { ...prev.iconBackground, ...(homeData.iconBackground || {}) },
            metaTitle: homeData.metaTitle || '',
            metaDescription: homeData.metaDescription || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
      } finally {
        setLoadingContent(false);
      }
    }
    async function getEvents() {
      try {
        setEvents(await fetchEvents());
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    }
    async function getNews() {
      try {
        setNews(await fetchNews());
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoadingNews(false);
      }
    }
    getContent();
    getEvents();
    getNews();
  }, []);

  const handleScroll = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
  };

  if (loadingContent) {
    return <div className="loading">Loading content...</div>;
  }

  const now = new Date();

  return (
    <HelmetProvider>
      <div className="home-page">
        <Helmet prioritizeSeoTags>
          <title>{content.metaTitle || content.hero.title}</title>
          <meta
            name="description"
            content={content.metaDescription || content.welcome.text1.slice(0, 160)}
          />
        </Helmet>

        {/* Hero Section */}
        <section className="hero">
          <video
            className="hero-video"
            src={content.hero.videoUrl || heroVideoDefault}
            autoPlay loop muted playsInline
          />
          <div className="hero-overlay">
            <div className="hero-text-inner">
              <h1>{content.hero.title}</h1>
              <p>{content.hero.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="info-section">
          <div className="info-left" onClick={handleScroll}>
            <img src={downArrow} alt="Down Arrow" className="down-arrow" />
          </div>
          <div className="info-right">
            <h2>
              <span className="greeting">{content.welcome.greeting}</span><br/>
              <span className="uni-name">{content.welcome.name}</span>
            </h2>
            <div className="body-text rich-text-content" dangerouslySetInnerHTML={{ __html: content.welcome.text1 }} />
            <div className="body-text rich-text-content" dangerouslySetInnerHTML={{ __html: content.welcome.text2 }} />
          </div>
        </section>

      {/* Icons Section */}
<section id="next-section" className="icon-section">
  <div className="icons-column">
    {[
      { src: icon1, hover: icon1Hover, label: 'Academic Progress', url: 'https://aum.mt/our-university' },
      { src: icon2, hover: icon2Hover, label: 'Student Housing', url: 'https://aum.mt/student-housing' },
      { src: icon3, hover: icon3Hover, label: 'Apply Now', url: 'https://aum.mt/apply' },
      { src: icon4, hover: icon4Hover, label: 'Academic Calendars', url: 'https://aum.edu.mt/academics/academic-calendar/' }
    ].map((item, i) => (
      <div
        key={i}
        className="icon-wrapper"
        onClick={() => {
          window.location.href = item.url; // works for both same and different domains
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="icon-button">
          <img src={item.src} alt={`Icon ${i + 1}`} className="default" />
          <img src={item.hover} alt={`Icon ${i + 1} Hover`} className="hover" />
        </div>
        <div className="icon-label">
          <p>{item.label}</p>
          <hr className="red-divider" />
        </div>
      </div>
    ))}
  </div>

  <div className="image-column">
    <img
      src={homeBackground || content.iconBackground?.url || bg1}
      alt="Background"
    />
  </div>
</section>

        {/* Upcoming Events */}
        <section className="upcoming-events">
          <h2 className="section-title">Upcoming Events</h2>
          {loadingEvents ? (
            <p>Loading events...</p>
          ) : events.length > 0 ? (
            <div className="events-container">
              {events.map(ev => {
                const eventDate = new Date(ev.date);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month:   'long',
                  day:     'numeric',
                  year:    'numeric'
                });
                const rawDiff = eventDate.getTime() - now.getTime();
                const diffDaysRaw = rawDiff / (1000*60*60*24);
                let diffDays = Math.ceil(diffDaysRaw);
                if (Number.isNaN(diffDays) || diffDays < 0) diffDays = null;
                const daysText =
                  diffDays === 0
                    ? 'Today'
                    : diffDays > 1
                    ? `${diffDays} days to the event`
                    : `${diffDays} day to the event`;

                return (
                  <div key={ev.id} className="event-card">
                    <div className="event-image">
                      {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} />}
                    </div>
                    <div className="event-details">
                      {diffDays != null && (
                        <div className="days-away">
                          <FiClock className="clock-icon" />
                          {daysText}
                        </div>
                      )}
                      <h3 className="event-title">{ev.title}</h3>
                      <p className="event-excerpt">{ev.excerpt}</p>
                      <p className="event-date">{formattedDate}</p>
                      <Link to={`/events/${ev.id}`} className="read-more">
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No events available at the moment.</p>
          )}
          <div className="section-footer">
            <Link to="/events" className="show-more">Show More</Link>
          </div>
          <hr className="section-divider" />
        </section>

        {/* Latest News */}
        <section className="latest-news">
          <h2 className="section-title">Latest News</h2>
          {loadingNews ? (
            <p>Loading news...</p>
          ) : news.length > 0 ? (
            <div className="news-container">
              {news.map(item => (
                <div key={item.id} className="news-card">
                  <div className="news-details">
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-excerpt">{item.excerpt}</p>
                    <Link to={`/news/${item.id}`} className="read-more">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No news available at the moment.</p>
          )}
          <div className="section-footer">
            <Link to="/news" className="show-more">Show More</Link>
          </div>
          <hr className="section-divider" />
        </section>
      </div>
    </HelmetProvider>
  );
}

export default Home;
