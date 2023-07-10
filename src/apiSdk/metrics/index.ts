import axios from 'axios';
import queryString from 'query-string';
import { MetricsInterface, MetricsGetQueryInterface } from 'interfaces/metrics';
import { GetQueryInterface } from '../../interfaces';

export const getMetrics = async (query?: MetricsGetQueryInterface) => {
  const response = await axios.get(`/api/metrics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMetrics = async (metrics: MetricsInterface) => {
  const response = await axios.post('/api/metrics', metrics);
  return response.data;
};

export const updateMetricsById = async (id: string, metrics: MetricsInterface) => {
  const response = await axios.put(`/api/metrics/${id}`, metrics);
  return response.data;
};

export const getMetricsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/metrics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMetricsById = async (id: string) => {
  const response = await axios.delete(`/api/metrics/${id}`);
  return response.data;
};
