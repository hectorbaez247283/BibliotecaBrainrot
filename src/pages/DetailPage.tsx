// src/pages/DetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ApiResponse, Character } from '../types/api.types';
import { Row, Col, Image, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../App';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/personajes/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar el personaje (Error 404)');
        
        const respuesta: ApiResponse<Character> = await response.json();
        setCharacter(respuesta.data);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (character) {
      e.currentTarget.src = `https://placehold.co/600x600/eeeeee/cccccc?text=${character.nombre}`;
    }
  };

  if (loading) return (
    <div className="text-center"><Spinner animation="border" /></div>
  );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!character) return <Alert variant="warning">Personaje no encontrado.</Alert>;

  return (
    <div className="bg-white p-4 p-md-5 rounded shadow-sm">
      
      <Link to="/">
        <Button variant="outline-dark" className="mb-4">
          &larr; Volver a Inicio
        </Button>
      </Link>
      
      <Row>
        <Col md={6} className="mb-3 mb-md-0 text-center">
          <Image 
            src={character.imagen} 
            alt={character.nombre} 
            fluid 
            rounded 
            onError={handleImageError}
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        </Col>
        <Col md={6}>
          <h1 className="fw-bold">{character.nombre}</h1>
          <p className="lead text-muted">{character.descripcion}</p>
          <hr />
          <div className="fs-5">
            <p>
              <strong className="me-2">Origen:</strong>
              {character.origen}
            </p>
            <p>
              <strong className="me-2">Popularidad:</strong>
              <Badge bg={character.popularidad === 'Alta' ? 'danger' : 'secondary'}>
                {character.popularidad}
              </Badge>
            </p>
            <div>
              <strong>Memes populares:</strong>
              <div className="mt-2">
                {character.memes.map((meme) => (
                  <Badge pill bg="primary" className="me-2 mb-2 fs-6" key={meme}>
                    {meme}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};