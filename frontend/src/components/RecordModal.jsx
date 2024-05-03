import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";

import { RecordContext } from "../contexts/RecordContext";
import { BaseUrlContext } from "../contexts/BaseUrlContext";

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
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const [readOnlyAccess, setReadOnlyAccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [dnsTypes, setDnsTypes] = useState([
    "A",
    "AAAA",
    "CNAME",
    "MX",
    "NS",
    "SOA",
    "SRV",
    "PTR",
    "TXT",
    "DNSSEC",
  ]);

  const { baseUrl } = useContext(BaseUrlContext);
  const { hostedZones, records, setRecords, record, setRecord } =
    useContext(RecordContext);

  useEffect(() => {
    if (Object.keys(record).length !== 0) {
      setReadOnlyAccess(true);
      setValue("name", record.name);
      setValue("type", record.type);
      setValue("value", record.value);
      setValue("hosted_zone_id", record.hosted_zone_id._id);
    }
  }, [record, setValue]);

  const handleModalClose = () => {
    reset();
    setRecord({});
    setReadOnlyAccess(false);
    handleClose();
  };

  const handleCreateRecord = async (data) => {
    let updatedRecords = [];

    try {
      let resp = await axios.post(`${baseUrl}/records/`, data, options);
      if (!resp?.data?.data) {
        alert("Response not found !!");
      }

      if (records.length > 0) {
        updatedRecords = [...records, resp.data.data];
      } else {
        updatedRecords.push(resp.data.data);
      }

      setRecords(updatedRecords);

      reset();
      handleClose();
    } catch (err) {
      console.log("Error while creating a record => ", err);
      alert("Error while creating a record, check console");
    }
  };

  const handleUpdateRecord = async (data) => {
    try {
      let resp = await axios.put(
        `${baseUrl}/records/${record._id}`,
        data,
        options
      );

      if (!resp?.data?.data) {
        alert("Response not found !!");
      }

      let updatedRecords = records.map((item) => {
        if (item._id === resp.data.data._id) {
          item = resp.data.data;
        }
        return item;
      });

      setRecords(updatedRecords);

      reset();
      setRecord({});
      setReadOnlyAccess(false);
      handleClose();
    } catch (err) {
      console.log("Error while updating a record => ", err);
      alert("Error while updating a record, check console");
    }
  };

  const onSubmit = async (data) => {
    if (Object.keys(record).length !== 0) {
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
          <h4 className="form-tite">
            {Object.keys(record).length === 0 ? "Create" : "Edit"} Record
          </h4>
          <div className="form-group">
            <label htmlFor="hosted_zone_id" className="input-label">
              Hosted Zone
            </label>
            <select
              className="input-field"
              disabled={readOnlyAccess}
              {...register("hosted_zone_id", {
                required: "Hosted Zone is required",
              })}
            >
              <option value="">Select</option>
              {hostedZones.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            {errors.hosted_zone_id && (
              <p role="alert" className="alert">
                {errors.hosted_zone_id.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              className="input-field"
              type="text"
              pattern="^[a-zA-Z.]+$"
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
              {dnsTypes.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
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
              pattern="^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))|([a-zA-Z][a-zA-Z0-9.]*)$"
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
