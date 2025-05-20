import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses
    fetch('http://localhost:5001/api/courses')
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });

    // Fetch study sessions
    fetch('http://localhost:5001/api/study-sessions')
      .then(response => response.json())
      .then(data => {
        setSessions(data);
      })
      .catch(error => {
        console.error('Error fetching sessions:', error);
      });
  }, []);

  // Sessioni di oggi 
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  });

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div className="container">
          <h1>Benvenuto su UniAssistant</h1>
          <p>Organizza i tuoi corsi e sessioni di studio in modo intelligente</p>
        </div>
      </div>
      
      <div className="container dashboard-content">
        <div className="dashboard-grid">
          <div className="card today-plan">
            <div className="card-header">
              <h2><span role="img" aria-label="calendario">📅</span> Piano di Studio di Oggi</h2>
            </div>
            
            {todaySessions.length > 0 ? (
              <div className="sessions-list">
                {todaySessions.map(session => (
                  <div className="session-item" key={session._id}>
                    <div className="session-time">
                      <span role="img" aria-label="orologio">⏰</span>
                      <span>{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="session-info">
                      <h4>{session.course ? session.course.name : 'Corso non specificato'}</h4>
                      <p>{session.topic}</p>
                    </div>
                    <div className="session-duration">
                      {session.duration} min
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nessuna sessione di studio pianificata per oggi.</p>
              </div>
            )}
            
            <Link to="/study-sessions" className="btn btn-primary">
              Pianifica Sessione
            </Link>
          </div>
          
          <div className="card progress-card">
            <div className="card-header">
              <h2><span role="img" aria-label="grafico">📊</span> I Tuoi Progressi</h2>
            </div>
            
            {sessions.length > 0 ? (
              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-value">{sessions.length}</span>
                  <span className="stat-label">Sessioni Totali</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {sessions.reduce((acc, session) => acc + (session.duration || 0), 0)}
                  </span>
                  <span className="stat-label">Minuti Studiati</span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Inizia a tracciare le tue sessioni di studio per vedere i progressi.</p>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="section-title">
          <span role="img" aria-label="libri">📚</span> I tuoi corsi
        </h3>
        
        {loading ? (
          <div className="loading">Caricamento corsi...</div>
        ) : courses.length > 0 ? (
          <div className="courses-preview">
            {courses.slice(0, 3).map(course => (
              <div 
                className="course-item" 
                key={course._id}
                style={{ borderColor: course.color }}
              >
                <h3>{course.name}</h3>
                <p className="course-professor">{course.professor}</p>
                <p className="course-credits">{course.credits} CFU</p>
              </div>
            ))}
            
            {courses.length > 3 && (
              <Link to="/courses" className="view-all-link">
                Visualizza tutti i {courses.length} corsi
              </Link>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>Non hai ancora aggiunto corsi. <Link to="/courses" className="link-highlight">Aggiungi il tuo primo corso</Link>.</p>
          </div>
        )}
        
        <div className="dashboard-tools">
          <h3 className="section-title">
            <span role="img" aria-label="strumenti">🛠️</span> Strumenti di studio
          </h3>
          
          <div className="tools-grid">
            <div className="tool-card">
              <h4>Timer Pomodoro</h4>
              <p>Utilizza la tecnica Pomodoro per studiare con più efficienza.</p>
              <Link to="/pomodoro" className="btn btn-primary">
                Vai al Timer
              </Link>
            </div>
            
            <div className="tool-card">
              <h4>Statistiche</h4>
              <p>Visualizza i tuoi progressi e analizza il tuo studio.</p>
              <Link to="/statistics" className="btn btn-primary">
                Vedi Statistiche
              </Link>
            </div>
            
            <div className="tool-card">
              <h4>Calendario</h4>
              <p>Visualizza il tuo piano di studio mensile.</p>
              <Link to="/calendar" className="btn btn-primary">
                Vai al Calendario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;