import {
  useEffect,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import api from "../../api/axios"

import DashboardLayout
from "../../layouts/DashboardLayout"

import DeskCard
from "../../components/DeskCard/DeskCard"

import RoomCard
from "../../components/RoomCard/RoomCard"

import Filters
from "../../components/Filters/Filters"

import "./WorkspaceList.css"

function WorkspaceList() {

  const navigate =
    useNavigate()

  const [workspaces,
    setWorkspaces] =
    useState([])

  const [desks,
    setDesks] =
    useState([])

  const [rooms,
    setRooms] =
    useState([])

  const [filter,
    setFilter] =
    useState("")

  useEffect(()=>{

    loadData()

  },[])

  const loadData =
    async ()=>{

      try {

        const wsRes =
          await api.get(
            "/workspaces"
          )

        setWorkspaces(
          wsRes.data
        )

        let allDesks=[]

        for(
          const ws
          of wsRes.data
        ){

          const res =
            await api.get(
              `/workspaces/desks/availability?workspace_id=${ws.id}`
            )

          allDesks=[
            ...allDesks,
            ...res.data
          ]
        }

        setDesks(
          allDesks
        )

        const roomRes =
          await api.get(
            "/workspaces/rooms"
          )

        setRooms(
          roomRes.data
        )

      } catch(err){

        console.log(err)
      }
    }

  const filtered =
    filter
      ? desks.filter(
          d =>
            d.seating_type
            === filter
        )
      : desks

  return (
    <DashboardLayout>

      <div
        className="workspace-page"
      >

        <h2>
          Workspaces
        </h2>

        <div
          className="desk-grid"
        >
          {workspaces.map(
            ws=>(
              <div
                key={ws.id}
                className="desk-card"
              >
                <h3>
                  {ws.name}
                </h3>

                <p>
                  {ws.location}
                </p>

                <p>
                  Floor:
                  {" "}
                  {ws.floor}
                </p>
              </div>
            )
          )}
        </div>

        <h2
          style={{
            marginTop:"35px"
          }}
        >
          Available Desks
        </h2>

        <Filters
          filter={filter}
          setFilter={setFilter}
        />

        <div
          className="desk-grid"
        >

          {filtered.map(
            desk => (

              <DeskCard
                key={desk.id}
                desk={desk}
                onReserve={()=>
                  navigate(
                    "/reserve",
                    {
                      state:{
                        desk
                      }
                    }
                  )
                }
              />
            )
          )}

        </div>

        <h2
          style={{
            marginTop:"35px"
          }}
        >
          Meeting Rooms
        </h2>

        <div
          className="desk-grid"
        >

          {rooms.map(
            room=>(
              <RoomCard
                key={room.id}
                room={room}
                onReserve={() =>
                  navigate(
                    "/reserve",
                    {
                      state:{
                        room
                      }
                    }
                  )
                }
              />
            )
          )}

        </div>

      </div>

    </DashboardLayout>
  )
}

export default WorkspaceList