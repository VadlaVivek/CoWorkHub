import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WorkspaceManagement.css";

const API = process.env.REACT_APP_API_URL;

function WorkspaceManagement() {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [message, setMessage] = useState("");

  const [workspaces, setWorkspaces] = useState([]);
  const [desks, setDesks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [workspace, setWorkspace] = useState({
    name: "",
    location: "",
    floor: "",
    pricing: "",
  });

  const [desk, setDesk] = useState({
    workspace_id: "",
    name: "",
    type: "",
  });

  const [room, setRoom] = useState({
    workspace_id: "",
    name: "",
    capacity: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ws = await axios.get(
        `${API}/api/workspaces`
      );

      const ds = await axios.get(
        `${API}/api/workspaces/desks`
      );

      const rm = await axios.get(
        `${API}/api/workspaces/rooms`
      );

      setWorkspaces(ws.data);
      setDesks(ds.data);
      setRooms(rm.data);
    } catch (err) {
      console.log(err);
    }
  };

  // CREATE WORKSPACE
  const createWorkspace = async () => {
    if (
      !workspace.name ||
      !workspace.location ||
      !workspace.floor ||
      !workspace.pricing
    ) {
      return setMessage(
        "Fill all workspace fields"
      );
    }

    try {
      await axios.post(
        `${API}/api/workspaces`,
        workspace,
        config
      );

      setMessage(
        "Workspace created"
      );

      setWorkspace({
        name: "",
        location: "",
        floor: "",
        pricing: "",
      });

      fetchData();
    } catch (err) {
      setMessage(
        err.response?.data?.message
      );
    }
  };

  // CREATE DESK
  const createDesk = async () => {
    if (
      !desk.workspace_id ||
      !desk.name ||
      !desk.type
    ) {
      return setMessage(
        "Fill all desk fields"
      );
    }

    try {
      await axios.post(
        `${API}/api/workspaces/desk`,
        desk,
        config
      );

      setMessage("Desk created");

      setDesk({
        workspace_id: "",
        name: "",
        type: "",
      });

      fetchData();
    } catch (err) {
      setMessage(
        err.response?.data?.message
      );
    }
  };

  // CREATE ROOM
  const createRoom = async () => {
    if (
      !room.workspace_id ||
      !room.name ||
      !room.capacity
    ) {
      return setMessage(
        "Fill all room fields"
      );
    }

    try {
      await axios.post(
        `${API}/api/workspaces/room`,
        room,
        config
      );

      setMessage("Room created");

      setRoom({
        workspace_id: "",
        name: "",
        capacity: "",
      });

      fetchData();
    } catch (err) {
      setMessage(
        err.response?.data?.message
      );
    }
  };

  return (
    <div className="page">
      <h1>
        Workspace Management
      </h1>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      <div className="manage-grid">

        {/* WORKSPACE */}
        <div className="card">
          <h2>
            Create Workspace
          </h2>

          <input
            placeholder="Name"
            value={workspace.name}
            onChange={(e) =>
              setWorkspace({
                ...workspace,
                name:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Location"
            value={
              workspace.location
            }
            onChange={(e) =>
              setWorkspace({
                ...workspace,
                location:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Floor"
            value={
              workspace.floor
            }
            onChange={(e) =>
              setWorkspace({
                ...workspace,
                floor:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Pricing"
            value={
              workspace.pricing
            }
            onChange={(e) =>
              setWorkspace({
                ...workspace,
                pricing:
                  e.target.value,
              })
            }
          />

          <button
            onClick={
              createWorkspace
            }
          >
            Create
          </button>
        </div>

        {/* DESK */}
        <div className="card">
          <h2>Create Desk</h2>

          <input
            placeholder="Workspace ID"
            value={
              desk.workspace_id
            }
            onChange={(e) =>
              setDesk({
                ...desk,
                workspace_id:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Desk Name"
            value={desk.name}
            onChange={(e) =>
              setDesk({
                ...desk,
                name:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Type"
            value={desk.type}
            onChange={(e) =>
              setDesk({
                ...desk,
                type:
                  e.target.value,
              })
            }
          />

          <button
            onClick={createDesk}
          >
            Create
          </button>
        </div>

        {/* ROOM */}
        <div className="card">
          <h2>Create Room</h2>

          <input
            placeholder="Workspace ID"
            value={
              room.workspace_id
            }
            onChange={(e) =>
              setRoom({
                ...room,
                workspace_id:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Room Name"
            value={room.name}
            onChange={(e) =>
              setRoom({
                ...room,
                name:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Capacity"
            value={
              room.capacity
            }
            onChange={(e) =>
              setRoom({
                ...room,
                capacity:
                  e.target.value,
              })
            }
          />

          <button
            onClick={createRoom}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceManagement;