import React, { useEffect, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";

import { RecordContext } from "../contexts/RecordContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  height: "auto",
  bgcolor: "var(--clr-white-light)",
  boxShadow: 20,
  p: 2,
};

const RecordModal = ({ open, handleClose }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  let { records, setRecords, record, setRecord } = useContext(RecordContext);

  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    if (record?._id) {
      setValue("name", record.name);
      setValue("type", record.type);
      setValue("value", record.value);
    }
  }, [record, setValue]);

  const handleModalClose = () => {
    reset();
    setRecord({});
    handleClose();
  };

  const handleCreateRecord = async (data) => {
    let updatedRecords = [];

    let resp = await axios.post(
      "https://dnsapp-iulk.onrender.com/records/",
      data,
      options
    );
    console.log("New record data from response", resp);

    if (resp?.data?.data) {
      reset();

      if(records.length > 0){
        updatedRecords = [...records, resp.data.data]
      }else{
        updatedRecords.push(resp.data.data);
      }

      setRecords(updatedRecords);
      handleClose();
    } else {
      alert("Record not found in response");
    }
  };

  const handleUpdateRecord = async (data) => {
    let resp = await axios.put(
      `https://dnsapp-iulk.onrender.com/records/${record._id}`,
      data,
      options
    );
    console.log("Updated record data from response", resp);

    if (resp?.data?.data) {
      reset();
      setRecord({});
      let updatedRecords = records.map((item) => {
        if (item._id === resp.data.data._id) {
          item = resp.data.data;
        }
        return item;
      });
      setRecords(updatedRecords);
      handleClose();
    } else {
      alert("Record not found in response");
    }
  };

  const onSubmit = async (data) => {
    console.log("record data from form => ", data);

    if (record?._id) {
      handleUpdateRecord(data);
    } else {
      handleCreateRecord(data);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <h4 className="form-tite">{record._id ? "Edit" : "Create"} Record</h4>
          <div className="form-group">
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              className="input-field"
              type="text"
              pattern="[A-Za-z]+(\s[A-Za-z]+)*"
              {...register("name", {
                required: "Name is required",
                min: 3,
              })}
            />
            {errors.name && (
              <p role="alert" className="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="type" className="input-label">
              Type
            </label>

            <select
              className="input-field"
              {...register("type", { required: "Type is required" })}
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="NS">NS</option>
              <option value="PTR">PTR</option>
              <option value="SOA">SOA</option>
              <option value="SRV">SRV</option>
              <option value="TXT">TXT</option>
              <option value="DNSSEC">DNSSEC</option>
            </select>

            {errors.type && (
              <p role="alert" className="alert">
                {errors.type.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="value" className="input-label">
              Value
            </label>
            <input
              className="input-field"
              type="text"
              {...register("value", {
                required: "Value is required",
              })}
            />
            {errors.value && (
              <p role="alert" className="alert">
                {errors.value.message}
              </p>
            )}
          </div>
          <button type="submit" className="form-btn">
            SUBMIT
          </button>
        </form>
      </Box>
    </Modal>
  );
};

export default RecordModal;
