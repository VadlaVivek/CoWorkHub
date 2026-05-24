import "./Filters.css"

function Filters({
  filter,
  setFilter
}) {

  return (
    <div className="filters">

      <select
        value={filter}
        onChange={e =>
          setFilter(
            e.target.value
          )
        }
      >

        <option value="">
          All
        </option>

        <option value="Window">
          Window
        </option>

        <option value="Private">
          Private
        </option>

      </select>

    </div>
  )
}

export default Filters