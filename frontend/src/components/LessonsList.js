import React, { useState, useEffect } from 'react';
import axios from '../utils/api';  // Importa il file axios configurato
import { 
  Card, Button, Form, ListGroup, Badge, 
  Spinner, Alert, Modal, Row, Col 
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaRegClock } from 'react-icons/fa';

const LessonsList = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    duration: '',
    notes: '',
    date: ''
  });
  const [editMode, setEditMode] = useState(false);

  // Statistiche
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [completedMinutes, setCompletedMinutes] = useState(0);

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    // Calcola statistiche
    let total = 0;
    let completed = 0;
    
    lessons.forEach(lesson => {
      total += lesson.duration;
      if (lesson.completed) {
        completed += lesson.duration;
      }
    });
    
    setTotalMinutes(total);
    setCompletedMinutes(completed);
  }, [lessons]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      console.log(`Richiesta lezioni per il corso: ${courseId}`);
      const response = await axios.get(`/api/lessons/course/${courseId}`);
      console.log('Risposta ricevuta:', response.data);
      setLessons(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Errore dettagliato:', err.response ? err.response.data : err.message);
      setError(`Errore nel caricamento delle lezioni: ${err.message}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({ ...currentLesson, [name]: value });
  };

  const resetForm = () => {
    setCurrentLesson({
      title: '',
      duration: '',
      notes: '',
      date: ''
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await axios.put(`/api/lessons/${currentLesson._id}`, {
          ...currentLesson,
          duration: parseInt(currentLesson.duration)
        });
      } else {
        await axios.post(`/api/lessons/course/${courseId}`, {
          ...currentLesson,
          duration: parseInt(currentLesson.duration)
        });
      }
      
      fetchLessons();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError('Errore nel salvare la lezione');
      console.error(err);
    }
  };

  // Prova
  const handleEdit = (lesson) => {
    setCurrentLesson({
      ...lesson,
      date: lesson.date ? new Date(lesson.date).toISOString().split('T')[0] : ''
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa lezione?')) {
      try {
        await axios.delete(`/api/lessons/${id}/course/${courseId}`);
        fetchLessons();
      } catch (err) {
        setError('Errore nell\'eliminazione della lezione');
        console.error(err);
      }
    }
  };

  const toggleCompletion = async (lesson) => {
    try {
      await axios.put(`/api/lessons/${lesson._id}`, {
        ...lesson,
        completed: !lesson.completed
      });
      
      fetchLessons();
    } catch (err) {
      setError('Errore nell\'aggiornamento della lezione');
      console.error(err);
    }
  };

  if (loading && lessons.length === 0) {
    return <Spinner animation="border" size="sm" />;
  }

  return (
    <div className="mb-5">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Statistiche Lezioni</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-3 mb-md-0">
              <h2>{lessons.length}</h2>
              <div className="text-muted">Lezioni totali</div>
            </Col>
            <Col md={4} className="text-center mb-3 mb-md-0">
              <h2>{totalMinutes} min</h2>
              <div className="text-muted">Durata totale</div>
            </Col>
            <Col md={4} className="text-center">
              <h2>{totalMinutes - completedMinutes} min</h2>
              <div className="text-muted">Ancora da completare</div>
            </Col>
          </Row>
          
          <div className="progress mt-4">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${totalMinutes ? (completedMinutes / totalMinutes) * 100 : 0}%`,
                backgroundColor: '#3a7bd5'
              }} 
              aria-valuenow={totalMinutes ? (completedMinutes / totalMinutes) * 100 : 0} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {totalMinutes ? Math.round((completedMinutes / totalMinutes) * 100) : 0}%
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Lezioni</h3>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <FaPlus /> Aggiungi Lezione
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {lessons.length === 0 ? (
        <Alert variant="info">
          Non ci sono lezioni per questo corso. Aggiungi la tua prima lezione!
        </Alert>
      ) : (
        <ListGroup>
          {lessons.map(lesson => (
            <ListGroup.Item 
              key={lesson._id}
              className="d-flex align-items-center"
            >
              <div 
                className="me-3" 
                style={{ cursor: 'pointer' }}
                onClick={() => toggleCompletion(lesson)}
              >
                <div 
                  className={`rounded-circle border d-flex align-items-center justify-content-center ${lesson.completed ? 'bg-success text-white' : ''}`}
                  style={{ width: '24px', height: '24px', borderWidth: '2px' }}
                >
                  {lesson.completed && <FaCheck size={12} />}
                </div>
              </div>
              
              <div className="flex-grow-1">
                <div className={`${lesson.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {lesson.title}
                </div>
                {lesson.notes && (
                  <small className="text-muted d-block">{lesson.notes}</small>
                )}
              </div>
              
              <div className="d-flex align-items-center">
                <Badge className="me-3" bg="light" text="dark">
                  <FaRegClock className="me-1" />
                  {lesson.duration} min
                </Badge>
                
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(lesson)}
                >
                  <FaEdit />
                </Button>
                
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(lesson._id)}
                >
                  <FaTrash />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Modifica' : 'Aggiungi'} Lezione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentLesson.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Durata (minuti)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={currentLesson.duration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={currentLesson.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={currentLesson.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowForm(false)}
                className="me-2"
              >
                Annulla
              </Button>
              <Button variant="primary" type="submit">
                Salva
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LessonsList;