import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

import DeskCard from "../../components/DeskCard/DeskCard";
import RoomCard from "../../components/RoomCard/RoomCard";
import Filters from "../../components/Filters/Filters";

import "./WorkspaceList.css";

function WorkspaceList() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [desks, setDesks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Workspaces
      const wsRes = await api.get("/workspaces");
      setWorkspaces(wsRes.data);

      // Desks
      const deskRes = await api.get("/workspaces/desks");
      setDesks(deskRes.data);

      // Rooms
      const roomRes = await api.get("/workspaces/rooms");
      setRooms(roomRes.data);
    } catch (err) {
      console.error("Error loading workspace data:", err);
    }
  };

  const filteredDesks = filter
    ? desks.filter(
        (desk) =>
          desk.type &&
          desk.type.toLowerCase() === filter.toLowerCase()
      )
    : desks;

  return (
    <DashboardLayout>
      <div className="workspace-page">

        {/* WORKSPACES */}

        <h2>Workspaces</h2>

        <div className="desk-grid">
          {workspaces.length > 0 ? (
            workspaces.map((ws) => (
              <div
                key={ws.id}
                className="desk-card"
              >
                <h3>{ws.name}</h3>

                <p>{ws.location}</p>

                <p>
                  Floor: {ws.floor}
                </p>

                <p>
                  Pricing: ₹{ws.pricing}
                </p>
              </div>
            ))
          ) : (
            <p>No workspaces available</p>
          )}
        </div>

        {/* DESKS */}

        <h2 style={{ marginTop: "35px" }}>
          Available Desks
        </h2>

        <Filters
          filter={filter}
          setFilter={setFilter}
        />

        <div className="desk-grid">
          {filteredDesks.length > 0 ? (
            filteredDesks.map((desk) => (
              <DeskCard
                key={desk.id}
                desk={desk}
                onReserve={() =>
                  navigate("/reserve", {
                    state: {
                      desk
                    }
                  })
                }
              />
            ))
          ) : (
            <p>No desks available</p>
          )}
        </div>

        {/* ROOMS */}

        <h2 style={{ marginTop: "35px" }}>
          Meeting Rooms
        </h2>

        <div className="desk-grid">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onReserve={() =>
                  navigate("/reserve", {
                    state: {
                      room
                    }
                  })
                }
              />
            ))
          ) : (
            <p>No meeting rooms available</p>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default WorkspaceList;