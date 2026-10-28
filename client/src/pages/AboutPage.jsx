import { Link } from 'react-router-dom';
import { Search, FileText, MessageCircle, CheckCircle, Shield, Zap, Users, BookOpen } from 'lucide-react';

// Step component for "How It Works" section
function Step({ number, icon, title, description, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid var(--border)',
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'flex-start',
      transition: 'box-shadow 0.2s, transform 0.2s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(79,70,229,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
          Step {number}
        </div>
        <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

// Tech stack card component
function TechCard({ icon, name, role, color }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '1.25rem',
      border: '1px solid var(--border)', textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{name}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: color, borderRadius: '999px', padding: '0.2rem 0.6rem', display: 'inline-block' }}>
        {role}
      </div>
    </div>
  );
}

// FAQ / Viva question card
function FaqCard({ q, a }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem',
      border: '1px solid var(--border)', marginBottom: '0.75rem',
    }}>
      <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
        Q: {q}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
        A: {a}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const steps = [
    {
      number: 1,
      icon: <FileText size={22} color="#4f46e5" />,
      title: 'Report the Item',
      description: 'Fill in the details of the item you lost or found on campus — name, category, description, location, and date. Add an optional image URL for better identification.',
      color: '#ede9fe',
    },
    {
      number: 2,
      icon: <Search size={22} color="#0891b2" />,
      title: 'Browse & Search',
      description: 'Search and filter through all reported items using keywords, categories, and locations. Find matching items quickly with our powerful filter system.',
      color: '#e0f2fe',
    },
    {
      number: 3,
      icon: <MessageCircle size={22} color="#059669" />,
      title: 'Make Contact',
      description: 'Found a match? The item details page shows contact information so you can reach the reporter. Always meet in a public place on campus to exchange items safely.',
      color: '#d1fae5',
    },
    {
      number: 4,
      icon: <CheckCircle size={22} color="#d97706" />,
      title: 'Resolve the Listing',
      description: 'Once the item is returned to its owner, mark the listing as "Resolved" in the Manage Listings page. This lets others know the item has been recovered.',
      color: '#fef3c7',
    },
  ];

  const techStack = [
    { icon: '⚛️', name: 'React.js', role: 'Frontend UI', color: '#e0f2fe' },
    { icon: '⚡', name: 'Vite', role: 'Build Tool', color: '#fef9c3' },
    { icon: '🌿', name: 'Node.js', role: 'Runtime', color: '#d1fae5' },
    { icon: '🚂', name: 'Express.js', role: 'Backend API', color: '#ede9fe' },
    { icon: '🍃', name: 'MongoDB', role: 'Database', color: '#d1fae5' },
    { icon: '🔗', name: 'Mongoose', role: 'ODM', color: '#fee2e2' },
    { icon: '🛤️', name: 'React Router', role: 'Navigation', color: '#fce7f3' },
    { icon: '📡', name: 'Axios', role: 'HTTP Client', color: '#e0f2fe' },
  ];

  const vivaQAs = [
    {
      q: 'What is the purpose of this project?',
      a: 'This is a Campus Lost & Found Portal — a full-stack web application that helps college students report lost and found items, browse listings, and communicate safely to recover belongings.',
    },
    {
      q: 'What is React.js and why did you use it?',
      a: 'React.js is a JavaScript library for building user interfaces. I used it because it allows me to build reusable components, manage state efficiently, and create a fast, interactive single-page application.',
    },
    {
      q: 'What is Node.js and Express.js?',
      a: 'Node.js is a JavaScript runtime that allows running JavaScript on the server side. Express.js is a web framework built on Node.js that makes it easy to create API endpoints and handle HTTP requests.',
    },
    {
      q: 'Why did you choose MongoDB?',
      a: 'MongoDB is a NoSQL database that stores data in flexible JSON-like documents. It is easy to set up, integrates well with JavaScript/Node.js through Mongoose, and does not require a fixed table structure like SQL databases.',
    },
    {
      q: 'What is CRUD?',
      a: 'CRUD stands for Create, Read, Update, and Delete — the four basic operations for managing data. In this project: Create = report an item, Read = browse/view items, Update = edit a listing or change its status, Delete = remove a listing.',
    },
    {
      q: 'What is an API?',
      a: 'API stands for Application Programming Interface. In this project, the backend provides a REST API — a set of URL endpoints (like /api/items) that the frontend calls to create, read, update, and delete data from the MongoDB database.',
    },
    {
      q: 'How does the frontend communicate with the backend?',
      a: 'The React frontend uses the Axios library to send HTTP requests (GET, POST, PUT, DELETE) to the Express.js backend API. The backend processes the request, interacts with MongoDB through Mongoose, and sends back a JSON response.',
    },
    {
      q: 'What is Mongoose?',
      a: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It allows us to define a schema (structure) for our data, validate inputs, and perform database operations using simple JavaScript methods like Item.find(), Item.create(), etc.',
    },
    {
      q: 'What is the folder structure of this project?',
      a: 'The project is divided into two main folders: "client" (React frontend built with Vite) and "server" (Node.js + Express backend). Inside server, there are separate folders for models (database schemas), routes (API endpoints), controllers (business logic), middleware (request processing), and config (database connection).',
    },
    {
      q: 'What are the main features of this application?',
      a: 'Key features include: reporting lost items, reporting found items, browsing and searching all listings with filters, viewing detailed item information, managing listings (edit, delete, update status), and a statistics dashboard on the home page.',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>About This Project</h1>
          <p>Campus Lost &amp; Found Portal — FLEXI CA-3 Mini Project</p>
        </div>
      </div>

      <div className="container section">
        {/* Project Introduction */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '20px', padding: '2.5rem', color: 'white', marginBottom: '3rem',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center',
        }}
          className="about-intro"
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '0.5rem' }}>
              FLEXI CA-3 Mini Project
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
              Campus Lost &amp; Found Portal
            </h2>
            <p style={{ opacity: 0.9, lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: '540px', fontSize: '0.95rem' }}>
              A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) 
              to help college students report lost items, browse found listings, and recover their belongings safely.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['PRN: 25070521245', 'Second-Year CSE', 'Full-Stack Project', 'MERN Stack'].map((tag) => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.15)', borderRadius: '999px',
                  padding: '0.3rem 0.8rem', fontSize: '0.78rem', fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '5rem', opacity: 0.3, display: 'none' }} className="about-emoji">
            🎓
          </div>
        </div>

        {/* Problem Statement */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Problem Statement
          </h2>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '1.75rem',
            border: '1px solid var(--border)', lineHeight: 1.8, color: 'var(--text-secondary)',
          }}>
            <p style={{ margin: '0 0 1rem' }}>
              College campuses are busy places where students frequently misplace or lose their personal belongings — 
              ID cards, phones, wallets, keys, notebooks, and more. Currently, most campuses rely on physical notice 
              boards or WhatsApp groups to report lost items, which are inefficient and not easily searchable.
            </p>
            <p style={{ margin: 0 }}>
              The <strong style={{ color: 'var(--text-primary)' }}>Campus Lost & Found Portal</strong> solves this by providing 
              a centralized digital platform where students can instantly report lost or found items, search listings by 
              category and location, and safely connect with reporters to recover their belongings.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>A simple 4-step process to recover lost items</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {steps.map((step) => <Step key={step.number} {...step} />)}
          </div>
        </div>

        {/* Technology Stack */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Technology Stack</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Built with the MERN stack — modern, industry-standard technologies</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {techStack.map((tech) => <TechCard key={tech.name} {...tech} />)}
          </div>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Key Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '🔴', title: 'Report Lost Items', desc: 'Submit detailed reports of lost items with category, location, date, and contact details' },
              { icon: '🟢', title: 'Report Found Items', desc: 'Report items you found on campus to help others recover their belongings' },
              { icon: '🔍', title: 'Search & Filter', desc: 'Search by keywords and filter by type, category, location, and status' },
              { icon: '📋', title: 'Manage Listings', desc: 'Edit, delete, and update the status of any listing from a single management page' },
              { icon: '📊', title: 'Live Statistics', desc: 'Real-time stats on total lost, found, and resolved items from the database' },
              { icon: '📱', title: 'Responsive Design', desc: 'Works perfectly on desktop, tablet, and mobile devices' },
              { icon: '🗄️', title: 'MongoDB Storage', desc: 'All data is stored in MongoDB Atlas — persistent across browser refreshes' },
              { icon: '⚡', title: 'REST API', desc: 'Clean Express.js REST API with proper validation and error handling' },
            ].map((f) => (
              <div key={f.title} style={{
                background: 'white', borderRadius: '12px', padding: '1.1rem 1.25rem',
                border: '1px solid var(--border)', display: 'flex', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viva Questions */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Viva Questions &amp; Answers
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Common questions a faculty might ask during project demonstration
          </p>
          {vivaQAs.map((qa, i) => <FaqCard key={i} q={qa.q} a={qa.a} />)}
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '16px', padding: '2rem',
          textAlign: 'center', border: '1px solid var(--border)',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>Ready to Get Started?</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
            Report a lost or found item, or browse existing listings on campus.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report-lost" className="btn btn-ghost">🔴 Report Lost Item</Link>
            <Link to="/report-found" className="btn btn-primary">🟢 Report Found Item</Link>
            <Link to="/browse" className="btn btn-ghost">Browse All Items</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
