import React from 'react';
import './BoardOfTrustees.css';

// Import actual images
import image1 from '../assets/image1.jpeg';
import image2 from '../assets/image2.jpeg';
import image3 from '../assets/image3.jpeg';
import image4 from '../assets/image4.jpeg';
import image5 from '../assets/image5.jpeg';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.jpeg';
import image8 from '../assets/image8.jpeg';
import image9 from '../assets/image9.jpeg';

function BoardOfTrustees() {
  const topLeadership = [
    {
      id: 1,
      image: image1,
      name: "Prince Jean Nassau",
      title: "Chairman, His Royal Highness Prince of Luxembourg"
    },
    {
      id: 2,
      image: image2,
      name: "Mr. Hani Salah",
      title: "Vice Chairman of Board of Trustees"
    },
    {
      id: 3,
      image: image3,
      name: "Dr. Saleh M. Abu Jado",
      title: "Board of Trustees General Secretary"
    }
  ];

  const members = [
    {
      id: 4,
      image: image4,
      name: "Dr. Omar Al-Jazy",
      title: "Founding Managing Partner of Aljazy & Co. (Advocates & Legal Consultants)"
    },
    {
      id: 5,
      image: image5,
      name: "Professor Derrick Gosselin",
      title: "Executive Chairman of the Belgian Nuclear Research Center SCK-CEN, Vice Chairman of the von Karman Institute for Fluid Dynamics"
    },
    {
      id: 6,
      image: image6,
      name: "Dr. Stephen Klimczuk-Massion",
      title: "Corporate and geopolitical strategist, scenario planner, board member, foundation director, author, and occasional fellow of the University of Oxford's Saïd Business School"
    },
    {
      id: 7,
      image: image7,
      name: "Hon. Chris Agius",
      title: "Maltese Politician, Member of the Parliament, Government of Malta Representative to the Board of Trustees"
    },
    {
      id: 8,
      image: image8,
      name: "Dr. Ibrahim Saif",
      title: "Former Jordan's Minister of Energy and Minister of Planning, and held roles as a senior scholar at Carnegie, director at the University of Jordan's Strategic Studies Centre, and consultant for the World Bank and IMF"
    },
    {
      id: 9,
      image: image9,
      name: "Dr. Taleb Al-Rifai",
      title: "Jordanian businessman and politician, former Secretary-General of the United Nations' World Tourism Organization, and former Minister of Information and Tourism in Jordan"
    }
  ];

  return (
    <div className="board-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>American University of Malta</h1>
        <p className="subtitle">Board of Trustees</p>
      </header>

      {/* Top Leadership */}
      <div className="top-leadership">
        {topLeadership.map((person) => (
          <div key={person.id} className="trustee-card">
            <div className="image-container">
              <img 
                src={person.image} 
                alt={person.name}
              />
            </div>
            <div className="trustee-info">
              <h2>{person.name}</h2>
              <p>{person.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Members Section */}
      <div className="members-section">
        <h2>American University of Malta</h2>
        <p className="members-subtitle">Members of the Board of Trustees</p>
        <div className="members-grid">
          {members.map((member) => (
            <div key={member.id} className="trustee-card">
              <div className="image-container">
                <img 
                  src={member.image}
                  alt={member.name}
                />
              </div>
              <div className="trustee-info">
                <h3>{member.name}</h3>
                <p>{member.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BoardOfTrustees;