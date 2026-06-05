import "./DeskCard.css"

function DeskCard({
  desk,
  onReserve
}) {

  return (
    <div className="desk-card">

      <h3>
        {desk.name}
      </h3>

      <p>
        Type:
        {" "}
        {desk.type}
      </p>

      <button
        onClick={() =>
          onReserve(desk)
        }
      >
        Reserve
      </button>

    </div>
  )
}

export default DeskCard