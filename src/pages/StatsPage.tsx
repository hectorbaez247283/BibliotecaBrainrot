// src/pages/StatsPage.tsx
// (¡Esta es la corrección final!)
import React, { useState, useEffect } from 'react';
import type { ApiResponse, Stats } from '../types/api.types';
import { Card, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { API_BASE_URL } from '../App';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) throw new Error('No se pudieron cargar las estadísticas');
        
        const respuesta: ApiResponse<Stats> = await response.json();
        setStats(respuesta.data); // Guardamos la data
        
        // Ya puedes borrar esta línea:
        // console.log("DATOS DE STATS RECIBIDOS:", respuesta.data);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="text-center"><Spinner animation="border" /></div>
  );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <Alert variant="info">No hay estadísticas disponibles.</Alert>;

  return (
    <Card className="shadow-sm">
      <Card.Header as="h2" className="fw-bold text-center">
        Estadísticas de BrainrotPedia
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex justify-content-between align-items-center fs-5">
          Total de Personajes:
          <Badge bg="primary" pill>{stats.totalPersonajes}</Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fs-5">
          Total de Memes:
          <Badge bg="success" pill>{stats.totalMemes}</Badge>
        </ListGroup.Item>

        <ListGroup.Item>
          <h3 className="fs-5 fw-bold mb-3">Orígenes Registrados:</h3>
          {stats.origenes.map((origen) => (
            <ListGroup.Item key={origen} className="d-flex justify-content-between">
              {origen}
            </ListGroup.Item>
          ))}
        </ListGroup.Item>
        <ListGroup.Item>
          <h3 className="fs-5 fw-bold mb-3">Niveles de Popularidad:</h3>
          {stats.nivelesPopularidad.map((nivel) => (
            <ListGroup.Item key={nivel} className="d-flex justify-content-between">
              {nivel}
            </ListGroup.Item>
          ))}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};