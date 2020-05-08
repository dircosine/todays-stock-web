import { useState, useEffect } from 'react';
import Axios from 'axios';
import { StockInfo } from '../lib/stock';

function useS3Download(resourceUrl: string) {
  const [data, setData] = useState<StockInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function download() {
      setLoading(true);
      try {
        const response = await Axios.get(resourceUrl);
        setData(response.data);
      } catch (e) {
        // exception here
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    download();

    return () => {
      setData(null);
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
