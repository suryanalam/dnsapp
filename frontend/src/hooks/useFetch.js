import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = (url, token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError ] = useState();
  let [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      try {
        let resp = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        setData(resp?.data?.data);
      } catch (err) {
        console.log('Error while fetching records: ',err)
        setError(err.response.data.message);
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return { loading, error, data };
};
