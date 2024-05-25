import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useFetchSlerf = (interval: number = 5000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://price-api-eight.vercel.app/api/slerf");
      setData(response.data);
    } catch (err) {
      setError(err as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error, refetch: fetchData };
};
