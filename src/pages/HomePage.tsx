import React, { useState, useEffect } from 'react';
import type { Character } from '../types/api.types';
import { API_BASE_URL } from '../App';
// Importamos los componentes de Bootstrap
import { Row, Col, Form, Alert, Spinner, Card, Button } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

//Componente de Tarjeta
interface CharacterCardProps {
  character: Character;
}
const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://placehold.co/600x400/eeeeee/cccccc?text=${character.name}`;
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={character.image} 
        onError={handleImageError} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{character.name}</Card.Title>
        <Card.Text className="text-muted small">
          {character.description}
        </Card.Text>
        <Link 
          to={`/character/${character.id}`} 
          className="d-grid text-decoration-none mt-auto"
        >
          <Button variant="primary">
            Ver detalles
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};


// --- Página Principal ---
export const HomePage: React.FC = () => {
  // Estados para guardar los datos, el buscador, la carga y errores
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect se ejecuta 1 vez al cargar la página para buscar los datos
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/characters`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los personajes');
        }
        const data: Character[] = await response.json();
        setCharacters(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 1. Título y Buscador */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Personajes de Brainrot</h1>
        <p className="lead text-muted">
          Los personajes más populares de internet
        </p>
        <Form.Control
          type="text"
          placeholder="Buscar personaje..."
          className="mx-auto"
          style={{ maxWidth: '500px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 2. Mensajes de Carga o Error */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* 3. Lista de Personajes */}
      {!loading && !error && (
        // 'g-4' es el espacio (gap) entre las tarjetas
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((char) => (
              <Col key={char.id}>
                <CharacterCard character={char} />
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No se encontraron personajes.</Alert>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};