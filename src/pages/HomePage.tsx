// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import type { Character } from '../types/api.types';
import { Row, Col, Form, Alert, Spinner, Card, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../App';
import { Link } from 'react-router-dom';

// --- Componente de Tarjeta (Sin cambios) ---
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


// --- Página Principal (Con Lógica de Búsqueda Mejorada) ---
export const HomePage: React.FC = () => {
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Inicia la carga y limpia errores
    setLoading(true);
    setError(null);

    const searchTimer = setTimeout(() => {
      
      const fetchApi = async () => {
        try {
          let url: string;

          if (searchTerm.trim() === '') {
            // Si la búsqueda está vacía, trae todos
            url = `${API_BASE_URL}/personajes`;
          } else {
            // Si hay búsqueda, usa el endpoint de search
            url = `${API_BASE_URL}/personajes/search/${encodeURIComponent(searchTerm)}`;
          }

          const response = await fetch(url);

          // Si la API devuelve 404 en una búsqueda, hay 0 resultados
          if (response.status === 404 && searchTerm.trim() !== '') {
            setDisplayedCharacters([]); 
          }
          // En caso de cualquier otro error
          else if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo conectar a la API`);
          }
          // Si todo funcinó 
          else {
            const data: Character[] = await response.json();
            setDisplayedCharacters(data);
          }

        } catch (err) {
          setError((err as Error).message);
          setDisplayedCharacters([]); // Limpiamos resultados en caso de error
        } finally {
          setLoading(false); // Terminamos
        }
      };
      
      fetchApi();

    }, 300); // 300ms de espera

    // 3. Función de "limpieza":
    return () => {
      clearTimeout(searchTimer);
    };

  }, [searchTerm]); 

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

      {/* 2. Mensaje de Error */}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* 3. Spinner de Carga */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Buscando...</p>
        </div>
      )}
      
      {/* 4. Lista de Personajes */}
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
                  ? 'No hay personajes para mostrar.'
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