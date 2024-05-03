import { useContext, useEffect, useState } from "react";
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
import HostedZoneModal from "../components/HostedZoneModal";

const HostedZones = () => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  const [open, setOpen] = useState(false);
  const { baseUrl } = useContext(BaseUrlContext);
  const { hostedZones, setHostedZones, setHostedZone } =
    useContext(RecordContext);

  const { data } = useFetch(`${baseUrl}/hosted_zones/`, token);

  useEffect(() => {
    if (data) {
      setHostedZones(data);
    }
  }, [data, setHostedZones]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = async (data) => {
    setHostedZone(data);
    setOpen(true);
  };

  const handleDelete = async (data) => {
    if (!window.confirm("Do you really want to delete?")) {
      return;
    }

    if (data.records_count > 0) {
      alert("Hosted Zone is not Empty !!");
      return;
    }

    try {
      let resp = await axios.delete(
        `${baseUrl}/hosted_zones/${data._id}`,
        options
      );

      if (!resp) {
        alert("Response not found !!");
      }
    } catch (err) {
      console.log("Error while deleting a record => ", err);
      alert("Error while deleting an record, check console !!");
    }

    let updatedhostedZones = hostedZones.filter(({ _id }) => _id !== data._id);
    setHostedZones(updatedhostedZones);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150, flex: 1 },
    { field: "name", headerName: "NAME", width: 150, flex: 1 },
    { field: "is_private", headerName: "Private Zone", width: 100, flex: 1 },
    {
      field: "description",
      headerName: "description",
      width: 200,
      flex: 1,
    },
    {
      field: "records_count",
      headerName: "Records Count",
      width: 150,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "actionsBar",
      width: 100,
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
              onClick={() => handleDelete(params.row)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="records-container-wrapper">
        <button type="button" className="record-btn" onClick={handleOpen}>
          <Add sx={{ fontSize: 18 }} />
          New Hosted Zone
        </button>

        {hostedZones.length > 0 && (
          <Box className="records-container">
            <DataGrid
              rows={hostedZones}
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
      {open && <HostedZoneModal open={open} handleClose={handleClose} />}
    </>
  );
};

export default HostedZones;
