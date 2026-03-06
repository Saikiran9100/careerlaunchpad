

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from "react-router-dom";
// import Navbar from "../../Components/Navbar/Navbar";
// import Slider from "react-slick";

// // --- Slider Styles ---
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

// // --- Components ---
// import ProjectList from '../../Components/Projects/ProjectList';      // For Freelancers/Public
// import InterviewList from '../../Components/Interview/InterviewList'; // For Freelancers/Public
// import JobList from '../../Components/Jobs/JobList';                 // For Freelancers/Public/Students
// import ClientProjectList from '../../Components/Client/ClientProjectList'; // For Clients
// import "./LandingPage.css";

// // --- Feature Card Component ---
// const FeatureCard = ({ icon, title, text }) => (
//   <div className="feature-card">
//     <div className="feature-icon">{icon}</div>
//     <h3>{title}</h3>
//     <p>{text}</p>
//   </div>
// );

// // --- Landing Page Component ---
// const LandingPage = () => {
//   const [userRole, setUserRole] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const role = localStorage.getItem("userRole");
//     const token = localStorage.getItem("token");
//     setUserRole(token ? role : null);
//   }, [location]);

//   const features = [
//     { icon: "🚀", title: "Launch Fast", text: "Turn your skills into paid gigs without waiting for graduation." },
//     { icon: "🎯", title: "Tailored Jobs", text: "Opportunities curated for students, updated daily." },
//     { icon: "🎤", title: "Interview Vault", text: "Learn from real interview stories of your seniors & peers." },
//     { icon: "🛡️", title: "Secure Growth", text: "Safe payments & dedicated support every step of the way." },
//   ];

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     pauseOnHover: true,
//   };

//   return (
//     <div className="landing-page">
//       <Navbar />
//       <header className="hero-section">
//        <div className="hero-content">
//          <h1>Your Campus. Your Skills. Your LaunchPad 🚀</h1>
//          <p>Earn while you learn, unlock career opportunities built for students, and explore interview journeys that started right where you are today.</p>
//          <div className="hero-buttons">
//            <Link to="/signup" className="hero-btn primary">I want to hire talent</Link>
//            <Link to="/signup" className="hero-btn secondary">I want to work & earn</Link>
//          </div>
//        </div>
//        <div className="hero-graphic">
//          <img src="https://cdn-icons-png.flaticon.com/512/3219/3219559.png" alt="Launchpad" />
//        </div>
//       </header>

//       {/* --- Carousel Section --- */}
//       <section className="carousel-section">
//         <Slider {...sliderSettings}>
//            <div className="carousel-slide">
//              <div className="slide-content">
//                <h2>💼 Earn as You Learn</h2>
//                <p>Start freelancing as a student, gain real-world experience, and get paid.</p>
//                <Link to="/signup" className="carousel-btn primary-btn">Get Started</Link>
//              </div>
//              <div className="slide-graphic">
//                <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" alt="Freelancing" />
//              </div>
//            </div>
//            <div className="carousel-slide">
//                <div className="slide-content">
//                  <h2>🚀 Jobs on Fast-Forward</h2>
//                  <p>Access jobs tailored for your skills, refreshed daily to keep you ahead.</p>
//                  <Link to="/features" className="carousel-btn secondary-btn">Explore Features</Link>
//                </div>
//                <div className="slide-graphic">
//                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Jobs" />
//                </div>
//              </div>
//              <div className="carousel-slide">
//                <div className="slide-content">
//                  <h2>🎤 Peer Interview Stories</h2>
//                  <p>Learn strategies that helped students from your campus land their dream jobs.</p>
//                  <Link to="/all-experiences" className="carousel-btn primary-btn">Explore Experiences</Link>
//                </div>
//                <div className="slide-graphic">
//                  <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="Interview" />
//                </div>
//              </div>
//         </Slider>
//       </section>

//       {/* --- Features Section --- */}
//       <main className="features-section page-section" id="features">
//        <div className="container">
//          <h2>Why CareerLaunchPad is Different?</h2>
//          <div className="features-grid">
//            {features.map((feature) => (
//              <FeatureCard key={feature.title} {...feature} />
//            ))}
//          </div>
//        </div>
//       </main>

//       {/* --- Conditional Section Rendering --- */}
//       {userRole === 'client' ? (
//          // --- CHANGED: limit is now 3 ---
//          <ClientProjectList limit={3} userRole={userRole} />
//       ) : userRole === 'student' ? (
//         <>
//           <div style={{ marginBottom: '4rem' }}>
//              <JobList limit={4} userRole={userRole} />
//           </div>
//           <InterviewList limit={4} userRole={userRole} />
//         </>
//       ) : (
//         <>
//           <div style={{ marginBottom: '4rem' }}>
//              <ProjectList limit={4} userRole={userRole} />
//           </div>
//           <div style={{ marginBottom: '4rem' }}>
//              <JobList limit={4} userRole={userRole} />
//           </div>
//           <InterviewList limit={4} userRole={userRole} />
//         </>
//       )}

//       {/* --- Footer --- */}
//       <footer className="footer-section">
//         <p>🌟 Every big career starts with a small launch. This is yours. 🌟</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;





import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Slider from "react-slick";

// --- Slider Styles ---
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- Components ---
import ProjectList from '../../Components/Projects/ProjectList';      // For Freelancers/Public
import InterviewList from '../../Components/Interview/InterviewList'; // For Freelancers/Public
import JobList from '../../Components/Jobs/JobList';                 // For Freelancers/Public/Students
import ClientProjectList from '../../Components/Client/ClientProjectList'; // For Clients
import "./LandingPage.css";

// --- Feature Card Component ---
const FeatureCard = ({ icon, title, text }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

// --- Landing Page Component ---
const LandingPage = () => {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    setUserRole(token ? role : null);
  }, [location]);

  const features = [
    { icon: "🚀", title: "Launch Fast", text: "Turn your skills into paid gigs without waiting for graduation." },
    { icon: "🎯", title: "Tailored Jobs", text: "Opportunities curated for students, updated daily." },
    { icon: "🎤", title: "Interview Vault", text: "Learn from real interview stories of your seniors & peers." },
    { icon: "🛡️", title: "Secure Growth", text: "Safe payments & dedicated support every step of the way." },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="landing-page">
      <Navbar />
      <header className="hero-section">
       <div className="hero-content">
         <h1>Your Campus. Your Skills. Your LaunchPad 🚀</h1>
         <p>Earn while you learn, unlock career opportunities built for students, and explore interview journeys that started right where you are today.</p>
         <div className="hero-buttons">
           <Link to="/signup" className="hero-btn primary">I want to hire talent</Link>
           <Link to="/signup" className="hero-btn secondary">I want to work & earn</Link>
         </div>
       </div>
       <div className="hero-graphic">
         <img src="https://cdn-icons-png.flaticon.com/512/3219/3219559.png" alt="Launchpad" />
       </div>
      </header>

      {/* --- Carousel Section --- */}
      <section className="carousel-section">
        <Slider {...sliderSettings}>
           <div className="carousel-slide">
             <div className="slide-content">
               <h2>💼 Earn as You Learn</h2>
               <p>Start freelancing as a student, gain real-world experience, and get paid.</p>
               <Link to="/signup" className="carousel-btn primary-btn">Get Started</Link>
             </div>
             <div className="slide-graphic">
               <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" alt="Freelancing" />
             </div>
           </div>
           <div className="carousel-slide">
               <div className="slide-content">
                 <h2>🚀 Jobs on Fast-Forward</h2>
                 <p>Access jobs tailored for your skills, refreshed daily to keep you ahead.</p>
                 <Link to="/features" className="carousel-btn secondary-btn">Explore Features</Link>
               </div>
               <div className="slide-graphic">
                 <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Jobs" />
               </div>
             </div>
             <div className="carousel-slide">
               <div className="slide-content">
                 <h2>🎤 Peer Interview Stories</h2>
                 <p>Learn strategies that helped students from your campus land their dream jobs.</p>
                 <Link to="/all-experiences" className="carousel-btn primary-btn">Explore Experiences</Link>
               </div>
               <div className="slide-graphic">
                 <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="Interview" />
               </div>
             </div>
        </Slider>
      </section>

      {/* --- Features Section --- */}
      <main className="features-section page-section" id="features">
       <div className="container">
         <h2>Why CareerLaunchPad is Different?</h2>
         <div className="features-grid">
           {features.map((feature) => (
             <FeatureCard key={feature.title} {...feature} />
           ))}
         </div>
       </div>
      </main>

      {/* --- Conditional Section Rendering --- */}
      {userRole === 'client' ? (
         // Clients see their own posted projects
         <ClientProjectList limit={3} userRole={userRole} />
      ) : userRole === 'student' ? (
        // Students see Jobs and Interviews
        <>
          <div style={{ marginBottom: '4rem' }}>
             {/* --- CHANGED: limit set to 3 to show only 3 cards --- */}
             <JobList limit={3} userRole={userRole} />
          </div>
          <InterviewList limit={4} userRole={userRole} />
        </>
      ) : (
        // Public/Guest see everything
        <>
          <div style={{ marginBottom: '4rem' }}>
             <ProjectList limit={4} userRole={userRole} />
          </div>
          <div style={{ marginBottom: '4rem' }}>
             {/* --- CHANGED: limit set to 3 to show only 3 cards --- */}
             <JobList limit={3} userRole={userRole} />
          </div>
          <InterviewList limit={4} userRole={userRole} />
        </>
      )}

      {/* --- Footer --- */}
      <footer className="footer-section">
        <p>🌟 Every big career starts with a small launch. This is yours. 🌟</p>
      </footer>
    </div>
  );
};

export default LandingPage;