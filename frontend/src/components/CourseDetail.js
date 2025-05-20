import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/api';  // Importa il file axios configurato
import { Container, Row, Col, Card, Button, Nav, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

// Components
import LessonsList from './LessonsList';
import TopicsList from './TopicsList';
import './CourseDetail.css'; 

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento del corso');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Corso non trovato</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Button 
        variant="outline-secondary" 
        className="mb-3"
        onClick={() => navigate('/courses')}
      >
  <FaArrowLeft className="me-2" /> Torna ai corsi
      </Button>
      
      <Card className="mb-4 shadow-sm">
        <Card.Header 
          className="py-3" 
          style={{ backgroundColor: course.color || '#3a7bd5', color: 'white' }}
        >
          <h2 className="mb-0">{course.name}</h2>
          <div className="text-white-50">Prof. {course.professor} • {course.credits} CFU</div>
        </Card.Header>
        <Card.Body>
          <p>{course.description}</p>
          
          <Row className="mt-3">
            <Col md={6}>
              <strong>Data inizio:</strong> {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Non specificata'}
            </Col>
            <Col md={6}>
              <strong>Data fine:</strong> {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'Non specificata'}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Nav 
        variant="tabs" 
        className="mb-4"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item>
          <Nav.Link eventKey="lessons">Lezioni</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="topics">Programma</Nav.Link>
        </Nav.Item>
      </Nav>
      
      {activeTab === 'lessons' ? (
        <LessonsList courseId={id} />
      ) : (
        <TopicsList courseId={id} />
      )}
    </Container>
  );
};

export default CourseDetail;