import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = (url, token) => {
  let [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let resp = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });

        if(!resp?.data?.data){
          alert('Records not found !!')
        }

        setData(resp.data.data);
      } catch (err) {
        console.log('Error while fetching records: ',err)
        alert("Error while fetching records,check console !!")
      }
    };

    fetchData();
  }, [url, token]);

  return { data };
};
