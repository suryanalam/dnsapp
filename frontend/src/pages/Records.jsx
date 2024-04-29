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
  const [open, setOpen] = useState(false);
  const { baseUrl } = useContext(BaseUrlContext);
  const { records, setRecords, setRecord } = useContext(RecordContext);

  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  const { loading, error, data } = useFetch(`${baseUrl}/records/`, token);

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
  }, [data, setRecords]);

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  if (error) {
    return (
      <div className="error-div">
        Error: <span>{error}</span>
      </div>
    );
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = async (data) => {
    setRecord(data);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    try {
      let resp = await axios.delete(`${baseUrl}/records/${id}`, options);
      console.log("delete resp: ", resp);

      if (!resp) {
        alert("Response not found !!");
      }
    } catch (err) {
      console.log("Error while deleting an record => ", err);
    }

    let updatedRecords = records.filter(({ _id }) => _id !== id);
    console.log("updated record afeter deletion: ", updatedRecords);
    setRecords(updatedRecords);
  };

  const columns = [
    { field: "Name", headerName: "NAME", width: 200, flex: 0.75 },
    { field: "Type", headerName: "TYPE", width: 100, flex: 0.75 },
    {
      field: "Value",
      headerName: "VALUE",
      width: 200,
      flex: 1.5,
      valueGetter: (params) => {
        const record = params.row; 
        return record.recordValues[0].value;
      },
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "actionsBar",
      width: 100,
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
    <div className="records-container-bg">
      <div className="records-container-wrapper">
        <button type="button" className="record-btn" onClick={handleOpen}>
          <Add sx={{ fontSize: 18 }} />
          New Record
        </button>
        <RecordModal open={open} handleClose={handleClose} />
        {records.length > 0 && (
          <Box className="records-container">
            <DataGrid
              rows={records}
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
    </div>
  );
};

export default Records;
