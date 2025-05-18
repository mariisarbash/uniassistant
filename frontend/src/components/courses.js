import React, { useState, useEffect } from 'react';
import './courses.css';
import { api } from '../services/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stati per il form di aggiunta/modifica
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    name: '',
    professor: '',
    credits: '',
    color: '#3a7bd5'
  });
  const [editMode, setEditMode] = useState(false);

  // Carica i corsi all'avvio del componente
  useEffect(() => {
    fetchCourses();
  }, []);

  // Funzione per caricare i corsi
  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    
    console.log('Tentativo di connessione a: /api/courses');
    
    api.get('/api/courses')
      .then(response => {
        console.log('Risposta ricevuta:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dati ricevuti:', data);
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore dettagliato:', err);
        setError(`Impossibile caricare i corsi: ${err.message}`);
        setLoading(false);
      });
  };

  // Gestisce il submit del form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validazione
    if (!currentCourse.name || !currentCourse.credits) {
      alert('Nome e crediti sono campi obbligatori');
      return;
    }
    
    // Preparazione dei dati da inviare
    const courseData = {
      ...currentCourse,
      credits: parseInt(currentCourse.credits)
    };
    
    // Usa un metodo diverso per aggiunta e modifica
    const apiMethod = editMode 
      ? api.patch(`/api/courses/${currentCourse._id}`, courseData)
      : api.post('/api/courses', courseData);
    
    apiMethod
      .then(response => {
        if (!response.ok) {
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        // Ricarica i corsi
        fetchCourses();
        // Reset del form
        resetForm();
      })
      .catch(err => {
        console.error('Errore nel salvataggio del corso:', err);
        alert('Errore durante il salvataggio. Verifica che il server sia in esecuzione.');
      });
  };
  
  // Gestisce l'eliminazione di un corso
  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo corso?')) {
      api.delete(`/api/courses/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Errore ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(() => {
          // Ricarica i corsi
          fetchCourses();
        })
        .catch(err => {
          console.error('Errore nell\'eliminazione del corso:', err);
          alert('Errore durante l\'eliminazione. Verifica che il server sia in esecuzione.');
        });
    }
  };
  
  // Prepara il form per la modifica
  const handleEdit = (course) => {
    setCurrentCourse({ ...course });
    setShowForm(true);
    setEditMode(true);
  };
  
  // Reset del form
  const resetForm = () => {
    setCurrentCourse({
      name: '',
      professor: '',
      credits: '',
      color: '#3a7bd5'
    });
    setShowForm(false);
    setEditMode(false);
  };
  
  // Gestisce il cambiamento degli input nel form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({
      ...currentCourse,
      [name]: value,
    });
  };

  return (
    <div className="courses-container">
      <div className="container">
        <div className="courses-header">
          <h2>I tuoi corsi</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Annulla' : 'Aggiungi Corso'}
          </button>
        </div>
        
        {showForm && (
          <div className="course-form-container">
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-group">
                <label>Nome del corso</label>
                <input
                  type="text"
                  name="name"
                  value={currentCourse.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Es. Matematica"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Professore</label>
                <input
                  type="text"
                  name="professor"
                  value={currentCourse.professor}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Es. Prof. Rossi"
                />
              </div>
              
              <div className="form-group">
                <label>Crediti (CFU)</label>
                <input
                  type="number"
                  name="credits"
                  value={currentCourse.credits}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Es. 6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Colore</label>
                <input
                  type="color"
                  name="color"
                  value={currentCourse.color}
                  onChange={handleChange}
                  className="form-control-color"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Aggiorna Corso' : 'Aggiungi Corso'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading ? (
          <div className="loading">Caricamento corsi...</div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={fetchCourses}>Riprova</button>
            <div className="troubleshooting">
              <h4>Possibili soluzioni:</h4>
              <ul>
                <li>Controlla che il server backend sia in esecuzione sulla porta 5001</li>
                <li>Verifica la connessione di rete</li>
                <li>Controlla la console del browser per errori specifici</li>
              </ul>
            </div>
          </div>
        ) : courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map(course => (
              <div 
                key={course._id} 
                className="course-card"
                style={{ borderTopColor: course.color }}
              >
                <h3 className="course-title">{course.name}</h3>
                <p className="course-professor">{course.professor}</p>
                <p className="course-credits">{course.credits} CFU</p>
                
                <div className="course-actions">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => handleEdit(course)}
                  >
                    <span role="img" aria-label="modifica">✏️</span>
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(course._id)}
                  >
                    <span role="img" aria-label="elimina">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Non hai ancora aggiunto corsi. Aggiungi il tuo primo corso con il pulsante qui sopra.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;