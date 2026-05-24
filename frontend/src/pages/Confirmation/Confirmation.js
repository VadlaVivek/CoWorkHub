import React, {
  useState
} from "react";

import axios from "axios";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import "./Confirmation.css";

const API =
process.env.REACT_APP_API_URL;

function Confirmation() {

  const navigate =
  useNavigate();

  const location =
  useLocation();

  const {
    deskId,
    roomId
  } =
  location.state || {};

  const [date,
  setDate] =
  useState("");

  const [duration,
  setDuration] =
  useState("");

  const [purpose,
  setPurpose] =
  useState("");

  const token =
  localStorage.getItem(
    "token"
  );

  const confirmBooking =
  async () => {

    if (
      !date ||
      !duration ||
      !purpose
    ) {
      return alert(
        "Fill all fields"
      );
    }

    try {

      await axios.post(
        `${API}/api/reservations`,
        {
          desk_id:
            deskId,
          room_id:
            roomId,
          date,
          duration,
          purpose
        },
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      alert(
        "Reservation Confirmed"
      );

      navigate(
        "/reservations"
      );

    } catch (err) {

      alert(
        err.response
          ?.data
          ?.message ||
        "Reservation failed"
      );
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">

        <h1>
          Reserve Space
        </h1>

        <input
          type="date"
          onChange={(e)=>
            setDate(
              e.target.value
            )
          }
        />

        <input
          placeholder="Duration"
          onChange={(e)=>
            setDuration(
              e.target.value
            )
          }
        />

        <input
          placeholder="Purpose"
          onChange={(e)=>
            setPurpose(
              e.target.value
            )
          }
        />

        <button
          onClick={
            confirmBooking
          }
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
}

export default Confirmation;