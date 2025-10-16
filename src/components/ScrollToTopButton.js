import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import './ScrollToTopButton.css';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button className="scroll-to-top" onClick={scrollToTop}>
      <FaChevronUp />
    </button>
  ) : null;
}

export default ScrollToTopButton;
