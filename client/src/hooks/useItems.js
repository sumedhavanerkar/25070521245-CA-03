import { useState, useEffect, useCallback } from 'react';
import { itemsApi } from '../services/api';

export const useItems = (initialParams = {}) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchItems = useCallback(async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemsApi.getAll(queryParams);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(params);
  }, [params, fetchItems]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  }, []);

  const refresh = useCallback(() => fetchItems(params), [params, fetchItems]);

  return { items, pagination, loading, error, updateParams, refresh };
};
