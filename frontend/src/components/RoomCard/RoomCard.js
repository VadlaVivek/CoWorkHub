import "./RoomCard.css"

function RoomCard({
  room,
  onReserve
}) {

  return (
    <div className="room-card">

      <h3>
        {room.name}
      </h3>

      <p>
        Capacity:
        {" "}
        {room.capacity}
      </p>

      <button
        onClick={() =>
          onReserve(room)
        }
      >
        Reserve Room
      </button>

    </div>
  )
}

export default RoomCard