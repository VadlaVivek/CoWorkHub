import {
  useLocation,
  useNavigate
} from "react-router-dom"

import { 
  useMemo,
  useState
 } from "react"

import api from "../../api/axios"
import DashboardLayout from "../../layouts/DashboardLayout"

import "./ReservationPage.css"

const emptyForm = {
  reservation_date:"",
  duration:"",
  purpose:"",
  attendee_count:1
}

const readSessionJson = (key, fallback) => {
  try {
    const saved =
      sessionStorage.getItem(key)

    return saved
      ? JSON.parse(saved)
      : fallback
  } catch {
    return fallback
  }
}

function ReservationPage() {

  const location = useLocation()
  const navigate = useNavigate()

  const savedSelection =
    useMemo(() => {
      return readSessionJson(
        "reservationSelection",
        {}
      )
    }, [])

  const desk =
    location.state?.desk ||
    savedSelection.desk

  const room =
    location.state?.room ||
    savedSelection.room


  const [form, setForm] =
    useState(() =>
      readSessionJson(
        "reservationDraft",
        emptyForm
      )
    )

  const [message, setMessage] =
    useState("")

  const [submitting, setSubmitting] =
    useState(false)

  // IMPORTANT FIX
  if (!desk && !room) {
    return (
      <DashboardLayout>
        <div className="reserve-card">
          <h2>No Desk Selected</h2>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(
                "reservationSelection"
              )

              sessionStorage.removeItem(
                "reservationDraft"
              )

              navigate("/")
            }}
          >
            Back
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const handleChange = e => {
    const nextForm = {
      ...form,
      [e.target.name]:
        e.target.value
    }

    setForm(nextForm)

    sessionStorage.setItem(
      "reservationDraft",
      JSON.stringify(nextForm)
    )
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setSubmitting(true);

  try {

  const payload = {
    workspace_id:
      desk?.workspace_id ||
      room?.workspace_id,

    desk_id: desk?.id || null,

    room_id: room?.id || null,

    ...form
  };

  const res = await api.post(
    "/reservations",
    payload
  );

  console.log("SUCCESS:", res.data);

  alert("Reservation Created");

  sessionStorage.removeItem(
    "reservationSelection"
  );

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
} finally {
  setSubmitting(false);
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
            value={
              form.reservation_date
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (hours)"
            value={
              form.duration
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            value={
              form.purpose
            }
            onChange={
              handleChange
            }
          />

          <input
            type="number"
            name="attendee_count"
            placeholder="Attendees"
            value={
              form.attendee_count
            }
            onChange={
              handleChange
            }
          />

          <button
            type="submit"
            disabled={submitting}
          >
            {
              submitting
                ? "Booking..."
                : "Confirm Booking"
            }
          </button>

        </form>

      </div>

    </DashboardLayout>
  )
}

export default ReservationPage