import React, { useState, useEffect } from 'react';
import type { Stats } from '../types/api.types';
import { API_BASE_URL } from '../App';
import { Card, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap'; // <-- ¡ESTA ES LA LÍNEA QUE FALTABA!

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
        const data: Stats = await response.json();
        setStats(data);
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
          <Badge bg="primary" pill>{stats.totalCharacters}</Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fs-5">
          Personaje más popular:
          <span className="fw-bold">{stats.mostPopular.name}</span>
        </ListGroup.Item>
        <ListGroup.Item>
          <h3 className="fs-5 fw-bold mb-3">Personajes por Serie:</h3>
          {stats.seriesCount.map((series) => (
            <div key={series.name} className="d-flex justify-content-between mb-1">
              <span>{series.name}</span>
              <Badge bg="secondary" pill>{series.count}</Badge>
            </div>
          ))}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};