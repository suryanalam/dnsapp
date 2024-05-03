import { useEffect, useContext, useState } from "react";
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

const HostedZoneModal = ({ open, handleClose }) => {
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

  let [readOnlyAccess, setReadOnlyAccess] = useState(false);

  const { baseUrl } = useContext(BaseUrlContext);
  const { hostedZones, setHostedZones, hostedZone, setHostedZone } =
    useContext(RecordContext);

  useEffect(() => {
    if (Object.keys(hostedZone).length !== 0) {
      setReadOnlyAccess(true);
      setValue("name", hostedZone.name);
      setValue("description", hostedZone.description);
    }
  }, [hostedZone, setValue]);

  const handleModalClose = () => {
    reset();
    setHostedZone({});
    setReadOnlyAccess(false);
    handleClose();
  };

  const handleCreatehostedZone = async (data) => {
    let updatedhostedZones = [];

    try{
      let resp = await axios.post(`${baseUrl}/hosted_zones/`, data, options);
      if(!resp?.data?.data){
        alert('Response not found !!');
      }

      if (hostedZones.length > 0) {
        updatedhostedZones = [...hostedZones, resp.data.data];
      } else {
        updatedhostedZones.push(resp.data.data);
      }

      setHostedZones(updatedhostedZones);

      reset();
      handleClose();
    }catch(err){
      console.log('Error while creating a hosted zone => ',err);
      alert('Error while creating a hosted zone, check console !!');
    }

  };

  const handleUpdatehostedZone = async (data) => {

    try{
      let resp = await axios.put(
        `${baseUrl}/hosted_zones/${hostedZone._id}`,
        data,
        options
      );

      if(!resp?.data?.data){
        alert('Response not found !!');
      }

      let updatedhostedZones = hostedZones.map((item) => {
        if (item._id === resp.data.data._id) {
          item = resp.data.data;
        }
        return item;
      });

      setHostedZones(updatedhostedZones);

      reset();
      setHostedZone({});
      setReadOnlyAccess(false);
      handleClose();
    }catch(err){
      console.log('Error while updating a hosted zone => ',err);
      alert('Error while updating a hosted zone, check console !!');
    }

  };

  const onSubmit = async (data) => {
    if (Object.keys(hostedZone).length !== 0) {
      handleUpdatehostedZone(data);
    } else {
      handleCreatehostedZone(data);
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
            {Object.keys(hostedZone).length === 0 ? "Create" : "Edit"} Hosted Zone
          </h4>
          <div className="form-group">
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              className="input-field"
              type="text"
              readOnly={readOnlyAccess}
              pattern="^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+)([a-zA-Z]{2,6})$"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p role="alert" className="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea className="input-field" {...register("description")} />
            {errors.description && (
              <p role="alert" className="alert">
                {errors.description.message}
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

export default HostedZoneModal;
