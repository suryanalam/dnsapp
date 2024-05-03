import { useState, useEffect, useContext } from "react";
import axios from "axios";

import "../assets/styles/Dashboard.css";
import { BaseUrlContext } from "../contexts/BaseUrlContext";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  let [recordsCount, setRecordsCount] = useState();
  let [hostedZonesCount, setHostedZonesCount] = useState();

  const { baseUrl } = useContext(BaseUrlContext);

  useEffect(() => {
    const getCount = async () => {
      try {
        let resp = await axios.get(`${baseUrl}/get_collections_count`, {
          headers: {
            Authorization: token,
          },
        });
        if(!resp?.data?.data){
          alert('Response not found !!')
        }

        setRecordsCount(resp.data.data.recordsCount)
        setHostedZonesCount(resp.data.data.hostedZonesCount);

      } catch (err) {
        console.log("Error while fetching collections count: ", err);
        alert("Error while fetching collections count, check console !!")
      }
    };

    getCount();
  }, [token, baseUrl]);

  return (
    <div className="dashboard-bg">
      <div className="featured-card-bg">
        <div className="featured-card-div">
          <h4 className="featured-card-title">IAM Users</h4>
          <p className="featured-card-number">5</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">Hosted Zones</h4>
          <p className="featured-card-number">{hostedZonesCount}</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">DNS Records</h4>
          <p className="featured-card-number">{recordsCount}</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">DNS Types</h4>
          <p className="featured-card-number">10</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
