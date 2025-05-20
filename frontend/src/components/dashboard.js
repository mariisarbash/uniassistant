import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarDay, FaChartLine, FaBook, FaTools, FaClock, FaUserGraduate } from 'react-icons/fa';
import axios from '../utils/api';
import './dashboard.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses
    axios.get('/api/courses')
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });

    // Fetch study sessions
    axios.get('/api/study-sessions')
      .then(response => {
        setSessions(response.data);
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
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-icon">
                <FaCalendarDay size={20} />
              </div>
              <h2>Piano di Studio di Oggi</h2>
            </div>
            
            <div className="card-body">
              {todaySessions.length > 0 ? (
                <div className="sessions-list">
                  {todaySessions.map(session => (
                    <div className="session-item" key={session._id}>
                      <div className="session-time">
                        <FaClock size={14} />
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
            </div>
            
            <div className="card-footer">
              <Link to="/study-sessions" className="btn btn-primary btn-block">
                Pianifica Sessione
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-icon">
                <FaChartLine size={20} />
              </div>
              <h2>I Tuoi Progressi</h2>
            </div>
            
            <div className="card-body">
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
            
            <div className="card-footer">
              <Link to="/statistics" className="btn btn-primary btn-block">
                Vedi Statistiche Complete
              </Link>
            </div>
          </div>
        </div>
        
        <div className="section-header">
          <h3 className="section-title">
            <FaBook size={18} /> I tuoi corsi
          </h3>
          
          <Link to="/courses" className="btn btn-primary">
            Vedi Tutti i Corsi
          </Link>
        </div>
        
        {loading ? (
          <div className="loading text-center py-4">Caricamento corsi...</div>
        ) : courses.length > 0 ? (
          <div className="courses-preview">
            {courses.slice(0, 3).map(course => (
              <div 
                className="course-item" 
                key={course._id}
                style={{ borderLeftColor: course.color || '#3a7bd5' }}
              >
                <h3>{course.name}</h3>
                <p className="course-professor">
                  <FaUserGraduate size={14} className="me-2" style={{ opacity: 0.7 }} />
                  {course.professor}
                </p>
                <p className="course-credits">
                  {course.credits} CFU
                </p>
                <Link to={`/courses/${course._id}`} className="link-highlight">
                  Visualizza dettagli
                </Link>
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
          <div className="section-header">
            <h3 className="section-title">
              <FaTools size={18} /> Strumenti di studio
            </h3>
          </div>
          
          <div className="tools-grid">
            <div className="tool-card">
              <h4>Timer Pomodoro</h4>
              <p>Utilizza la tecnica Pomodoro per studiare con più efficienza e produttività.</p>
              <Link to="/pomodoro" className="btn btn-primary">
                Vai al Timer
              </Link>
            </div>
            
            <div className="tool-card">
              <h4>Statistiche</h4>
              <p>Visualizza i tuoi progressi e analizza il tuo studio con grafici dettagliati.</p>
              <Link to="/statistics" className="btn btn-primary">
                Vedi Statistiche
              </Link>
            </div>
            
            <div className="tool-card">
              <h4>Calendario</h4>
              <p>Visualizza il tuo piano di studio mensile e organizza le sessioni di studio.</p>
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