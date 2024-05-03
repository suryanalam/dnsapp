import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import Add from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useFetch } from "../hooks/useFetch";
import { RecordContext } from "../contexts/RecordContext";
import { BaseUrlContext } from "../contexts/BaseUrlContext";

import "../assets/styles/Records.css";
import RecordModal from "../components/RecordModal";

const Records = () => {
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState(null);

  const { baseUrl } = useContext(BaseUrlContext);
  const { hostedZones, setHostedZones, records, setRecords, setRecord } =
    useContext(RecordContext);

  const { data } = useFetch(`${baseUrl}/records/`, token);

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
  }, [data, setRecords]);

  useEffect(() => {
    const getHostedZones = async () => {
      try {
        let resp = await axios.get(`${baseUrl}/hosted_zones/`, {
          headers: {
            Authorization: token,
          },
        });

        if (!resp?.data?.data) {
          alert("hosted zones not found");
        }

        setHostedZones(resp.data.data);
      } catch (err) {
        console.log("Error while fetching hosted zones => ", err);
        alert("Error while fetching hosted zones, check the console !!");
      }
    };
    getHostedZones();
  }, [baseUrl, token, setHostedZones]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = async (data) => {
    setRecord(data);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you really want to delete?")) {
      return;
    }

    try {
      let resp = await axios.delete(`${baseUrl}/records/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!resp) {
        alert("Response not found !!");
      }
    } catch (err) {
      console.log("Error while deleting an record => ", err);
      alert("Error while deleting an record, check the console !!");
    }

    let updatedRecords = records.filter(({ _id }) => _id !== id);
    setRecords(updatedRecords);
  };

  const handleFilterRecords = async (e) => {
    if(e.target.value === ""){
      setFilteredRecords(null);
      return ;
    }

    let filteredData = records.filter(
      (record) => record.hosted_zone_id._id === e.target.value
    );
    setFilteredRecords(filteredData);
  };

  const columns = [
    { field: "name", headerName: "NAME", width: 200, flex: 1 },
    { field: "type", headerName: "TYPE", width: 200, flex: 1 },
    {
      field: "value",
      headerName: "VALUE",
      width: 200,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "actionsBar",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="edit-icon"
              onClick={() => handleEdit(params.row)}
            />
            <DeleteIcon
              className="delete-icon"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="records-container-wrapper">
        <div className="records-header-container">
          <button type="button" className="record-btn" onClick={handleOpen}>
            <Add sx={{ fontSize: 18 }} />
            New Record
          </button>
          <select
            className="records-filter-dropdown"
            onChange={handleFilterRecords}
          >
            <option value="">Select Hosted Zone</option>
            {hostedZones.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {records.length > 0 && (
          <Box className="records-container">
            <DataGrid
              rows={filteredRecords === null ? records : filteredRecords}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{
                "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                  color: "var(--clr-white-dark)",
                  background: "var(--clr-primary) !important",
                },
              }}
            />
          </Box>
        )}
      </div>

      {open && <RecordModal open={open} handleClose={handleClose} />}
    </>
  );
};

export default Records;
