import {
  useState,
  useEffect
} from "react"

import api from "../../api/axios"
import DashboardLayout from "../../layouts/DashboardLayout"

import "./WorkspaceManagement.css"

function WorkspaceManagement() {

  const [message,setMessage]=
    useState("")

  const [workspaces,setWorkspaces]=
    useState([])

  const [desks,setDesks]=
    useState([])

  const [rooms,setRooms]=
    useState([])

  const [workspace,setWorkspace]=
    useState({
      name:"",
      location:"",
      floor:"",
      pricing:""
    })

  const [desk,setDesk]=
    useState({
      workspace_id:"",
      desk_name:"",
      seating_type:""
    })

  const [room,setRoom]=
    useState({
      workspace_id:"",
      room_name:"",
      capacity:""
    })

  useEffect(()=>{
    loadData()
  },[])

  const loadData =
    async ()=>{

      const ws =
        await api.get(
          "/workspaces"
        )

      setWorkspaces(
        ws.data
      )

      let allDesks=[]

      for(
        const w
        of ws.data
      ){

        const d =
          await api.get(
            `/workspaces/desks/availability?workspace_id=${w.id}`
          )

        allDesks=[
          ...allDesks,
          ...d.data
        ]
      }

      setDesks(
        allDesks
      )

      const r =
        await api.get(
          "/workspaces/rooms"
        )

      setRooms(
        r.data
      )
    }

  // CREATE

  const createWorkspace =
    async e=>{

      e.preventDefault()

      try{

        await api.post(
          "/workspaces",
          workspace
        )

        setMessage(
          "Workspace created"
        )

        loadData()

      }catch(err){

        setMessage(
          err.response?.data
          ?.message
        )
      }
    }

  const createDesk =
    async e=>{

      e.preventDefault()

      try{

        await api.post(
          "/workspaces/desk",
          desk
        )

        setMessage(
          "Desk created"
        )

        loadData()

      }catch(err){

        setMessage(
          err.response?.data
          ?.message
        )
      }
    }

  const createRoom =
    async e=>{

      e.preventDefault()

      try{

        await api.post(
          "/workspaces/room",
          room
        )

        setMessage(
          "Room created"
        )

        loadData()

      }catch(err){

        setMessage(
          err.response?.data
          ?.message
        )
      }
    }

  // DELETE

  const deleteWorkspace =
    async id=>{

      await api.delete(
        `/workspaces/${id}`
      )

      loadData()
    }

  const deleteDesk =
    async id=>{

      await api.delete(
        `/workspaces/desk/${id}`
      )

      loadData()
    }

  const deleteRoom =
    async id=>{

      await api.delete(
        `/workspaces/room/${id}`
      )

      loadData()
    }

  return (
    <DashboardLayout>

      <div className="manage-page">

        <h2>
          Workspace Management
        </h2>

        {message &&
          <p>{message}</p>
        }

        {/* CREATE */}

        <div
          className="manage-grid"
        >

          <form
            className="manage-card"
            onSubmit={
              createWorkspace
            }
          >

            <h3>
              Create Workspace
            </h3>

            <input
              placeholder="Name"
              onChange={e=>
                setWorkspace({
                  ...workspace,
                  name:e.target.value
                })
              }
            />

            <input
              placeholder="Location"
              onChange={e=>
                setWorkspace({
                  ...workspace,
                  location:e.target.value
                })
              }
            />

            <input
              placeholder="Floor"
              onChange={e=>
                setWorkspace({
                  ...workspace,
                  floor:e.target.value
                })
              }
            />

            <input
              placeholder="Pricing"
              onChange={e=>
                setWorkspace({
                  ...workspace,
                  pricing:e.target.value
                })
              }
            />

            <button>
              Create
            </button>

          </form>

          <form
            className="manage-card"
            onSubmit={
              createDesk
            }
          >

            <h3>
              Create Desk
            </h3>

            <input
              placeholder="Workspace ID"
              onChange={e=>
                setDesk({
                  ...desk,
                  workspace_id:e.target.value
                })
              }
            />

            <input
              placeholder="Desk Name"
              onChange={e=>
                setDesk({
                  ...desk,
                  desk_name:e.target.value
                })
              }
            />

            <input
              placeholder="Seating Type"
              onChange={e=>
                setDesk({
                  ...desk,
                  seating_type:e.target.value
                })
              }
            />

            <button>
              Create
            </button>

          </form>

          <form
            className="manage-card"
            onSubmit={
              createRoom
            }
          >

            <h3>
              Create Room
            </h3>

            <input
              placeholder="Workspace ID"
              onChange={e=>
                setRoom({
                  ...room,
                  workspace_id:e.target.value
                })
              }
            />

            <input
              placeholder="Room Name"
              onChange={e=>
                setRoom({
                  ...room,
                  room_name:e.target.value
                })
              }
            />

            <input
              placeholder="Capacity"
              onChange={e=>
                setRoom({
                  ...room,
                  capacity:e.target.value
                })
              }
            />

            <button>
              Create
            </button>

          </form>

        </div>

        {/* DELETE SECTION */}

        <h2
          style={{
            marginTop:"40px"
          }}
        >
          Existing Resources
        </h2>

        <div className="manage-grid">

          <div className="manage-card">

            <h3>
              Workspaces
            </h3>

            {workspaces.map(
              ws=>(
                <div className="manage-existing-column" key={ws.id}>
                  {ws.name}
                  <button className="delete-button"
                    onClick={()=>deleteWorkspace(ws.id)}
                  >
                    Delete
                  </button>
                </div>
              )
            )}

          </div>

          <div className="manage-card">

            <h3>
              Desks
            </h3>

            {desks.map(
              d=>(
                <div className="manage-existing-column" key={d.id}>
                  {d.desk_name}
                  <button className="delete-button"
                    onClick={()=>deleteDesk(d.id)}
                  >
                    Delete
                  </button>
                </div>
              )
            )}

          </div>

          <div className="manage-card">

            <h3>
              Rooms
            </h3>

            {rooms.map(
              r=>(
                <div className="manage-existing-column" key={r.id}>
                  {r.room_name}
                  <button className="delete-button"
                    onClick={()=>deleteRoom(r.id)}
                  >
                    Delete
                  </button>
                </div>
              )
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default WorkspaceManagement