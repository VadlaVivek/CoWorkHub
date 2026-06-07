import {
  useLocation,
  useNavigate
} from "react-router-dom"

import { useState } from "react"

import api from "../../api/axios"
import DashboardLayout from "../../layouts/DashboardLayout"

import "./ReservationPage.css"

function ReservationPage() {

  const location = useLocation()
  const navigate = useNavigate()

  const desk = location.state?.desk

  const room = location.state?.room

  const [form, setForm] =
    useState({
      reservation_date:"",
      duration:"",
      purpose:"",
      attendee_count:1
    })

  const [message, setMessage] =
    useState("")

  // IMPORTANT FIX
  if (!desk && !room) {
    return (
      <DashboardLayout>
        <div className="reserve-card">
          <h2>No Desk Selected</h2>
          <button
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting reservation");

  try {

  const payload = {
    workspace_id:
      desk?.workspace_id ||
      room?.workspace_id,

    desk_id: desk?.id || null,

    room_id: room?.id || null,

    ...form
  };

  console.log("Submitting:", payload);

  const res = await api.post(
    "/reservations",
    payload
  );

  console.log("SUCCESS:", res.data);

  alert("Reservation Created");

  navigate("/reservations");

} catch (err) {

  console.log("ERROR:", err);
  console.log("RESPONSE:", err.response);

  alert(
    err.response?.data?.message ||
    err.message
  );

  setMessage(
    err.response?.data?.message ||
    "Booking failed"
  );
}
};

  return (
    <DashboardLayout>

      <div className="reserve-card">

        <h2>
          Reserve
          {" "}
          {
            desk?.name
            ||
            room?.name
          }
        </h2>

        {message &&
          <p>{message}</p>
        }

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="date"
            name="reservation_date"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (hours)"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            onChange={
              handleChange
            }
          />

          <input
            type="number"
            name="attendee_count"
            placeholder="Attendees"
            onChange={
              handleChange
            }
          />

          <button>
            Confirm Booking
          </button>

        </form>

      </div>

    </DashboardLayout>
  )
}

export default ReservationPage