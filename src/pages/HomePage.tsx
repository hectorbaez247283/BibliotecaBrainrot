// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import type { ApiResponse, Character } from '../types/api.types';
import { Row, Col, Form, Alert, Spinner, Card, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../App';
import { Link } from 'react-router-dom';

//Componente de Tarjeta
interface CharacterCardProps {
  character: Character;
}
const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://placehold.co/600x400/eeeeee/cccccc?text=${character.nombre}`;
  };

  return (
    <Card className="h-100 shadow-sm card-hover">
      <Card.Img 
        variant="top" 
        src={character.imagen} 
        onError={handleImageError} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{character.nombre}</Card.Title>
        <Card.Text className="text-muted small">
          {character.descripcion}
        </Card.Text>
        <Link 
          to={`/character/${character.id}`} 
          className="d-grid text-decoration-none mt-auto"
        >
          <Button variant="dark">
            Ver detalles
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};


//Página Principal
export const HomePage: React.FC = () => {
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const searchTimer = setTimeout(() => {
      const fetchApi = async () => {
        try {
          let url: string;
          if (searchTerm.trim() === '') {
            url = `${API_BASE_URL}/personajes`;
          } else {
            url = `${API_BASE_URL}/personajes/search/${encodeURIComponent(searchTerm)}`;
          }

          const response = await fetch(url);

          if (response.status === 404 && searchTerm.trim() !== '') {
            setDisplayedCharacters([]);
          }
          else if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo conectar a la API`);
          }
          else {
            const respuesta: ApiResponse<Character[]> = await response.json();
            setDisplayedCharacters(respuesta.data);
          }

        } catch (err) {
          setError((err as Error).message);
          setDisplayedCharacters([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchApi();
    }, 300);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [searchTerm]);

  
  return (
    <div>
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

      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Buscando...</p>
        </div>
      )}
      
      {!loading && !error && (
        <Row xs={1} md={2} lg={3} className="g-4">
          
          {displayedCharacters.length > 0 && (
            displayedCharacters.map((char) => (
              <Col key={char.id}>
                <CharacterCard character={char} />
              </Col>
            ))
          )}
          
          {displayedCharacters.length === 0 && (
            <Col>
              <Alert variant="info">
                {searchTerm === ''
                  ? 'Cargando personajes...'
                  : `No se encontraron personajes para "${searchTerm}".`
                }
              </Alert>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};