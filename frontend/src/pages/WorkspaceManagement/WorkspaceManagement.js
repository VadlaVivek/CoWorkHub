import { useState, useEffect } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import "./WorkspaceManagement.css";

function WorkspaceManagement() {
  const [message, setMessage] = useState("");

  const [workspaces, setWorkspaces] = useState([]);
  const [desks, setDesks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [workspace, setWorkspace] = useState({
    name: "",
    location: "",
    floor: "",
    pricing: ""
  });

  const [desk, setDesk] = useState({
    workspace_id: "",
    name: "",
    type: ""
  });

  const [room, setRoom] = useState({
    workspace_id: "",
    name: "",
    capacity: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ws = await api.get("/workspaces");
      setWorkspaces(ws.data);

      const desksResponse = await api.get("/workspaces/desks");
      setDesks(desksResponse.data);

      const roomsResponse = await api.get("/workspaces/rooms");
      setRooms(roomsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // CREATE WORKSPACE
  // ==========================

  const createWorkspace = async (e) => {
    e.preventDefault();

    try {
      await api.post("/workspaces", workspace);

      setMessage("Workspace created successfully");

      setWorkspace({
        name: "",
        location: "",
        floor: "",
        pricing: ""
      });

      loadData();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error creating workspace"
      );
    }
  };

  // ==========================
  // CREATE DESK
  // ==========================

  const createDesk = async (e) => {
    e.preventDefault();

    try {
      await api.post("/workspaces/desk", desk);

      setMessage("Desk created successfully");

      setDesk({
        workspace_id: "",
        name: "",
        type: ""
      });

      loadData();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error creating desk"
      );
    }
  };

  // ==========================
  // CREATE ROOM
  // ==========================

  const createRoom = async (e) => {
    e.preventDefault();

    try {
      await api.post("/workspaces/room", room);

      setMessage("Room created successfully");

      setRoom({
        workspace_id: "",
        name: "",
        capacity: ""
      });

      loadData();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error creating room"
      );
    }
  };

  // ==========================
  // DELETE WORKSPACE
  // ==========================

  const deleteWorkspace = async (id) => {
    try {
      await api.delete(`/workspaces/${id}`);

      setMessage("Workspace deleted");

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // DELETE DESK
  // ==========================

  const deleteDesk = async (id) => {
    try {
      await api.delete(`/workspaces/desk/${id}`);

      setMessage("Desk deleted");

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // DELETE ROOM
  // ==========================

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/workspaces/room/${id}`);

      setMessage("Room deleted");

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="manage-page">
        <h2>Workspace Management</h2>

        {message && (
          <div
            style={{
              background: "#dff0d8",
              color: "#3c763d",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "20px"
            }}
          >
            {message}
          </div>
        )}

        {/* CREATE SECTION */}

        <div className="manage-grid">
          {/* Workspace */}

          <form
            className="manage-card"
            onSubmit={createWorkspace}
          >
            <h3>Create Workspace</h3>

            <input
              type="text"
              placeholder="Name"
              value={workspace.name}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  name: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={workspace.location}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  location: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Floor"
              value={workspace.floor}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  floor: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Pricing"
              value={workspace.pricing}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  pricing: e.target.value
                })
              }
            />

            <button type="submit">
              Create Workspace
            </button>
          </form>

          {/* Desk */}

          <form
            className="manage-card"
            onSubmit={createDesk}
          >
            <h3>Create Desk</h3>

            <input
              type="number"
              placeholder="Workspace ID"
              value={desk.workspace_id}
              onChange={(e) =>
                setDesk({
                  ...desk,
                  workspace_id: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Desk Name"
              value={desk.name}
              onChange={(e) =>
                setDesk({
                  ...desk,
                  name: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Desk Type"
              value={desk.type}
              onChange={(e) =>
                setDesk({
                  ...desk,
                  type: e.target.value
                })
              }
            />

            <button type="submit">
              Create Desk
            </button>
          </form>

          {/* Room */}

          <form
            className="manage-card"
            onSubmit={createRoom}
          >
            <h3>Create Room</h3>

            <input
              type="number"
              placeholder="Workspace ID"
              value={room.workspace_id}
              onChange={(e) =>
                setRoom({
                  ...room,
                  workspace_id: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Room Name"
              value={room.name}
              onChange={(e) =>
                setRoom({
                  ...room,
                  name: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Capacity"
              value={room.capacity}
              onChange={(e) =>
                setRoom({
                  ...room,
                  capacity: e.target.value
                })
              }
            />

            <button type="submit">
              Create Room
            </button>
          </form>
        </div>

        {/* EXISTING RESOURCES */}

        <h2 style={{ marginTop: "40px" }}>
          Existing Resources
        </h2>

        <div className="manage-grid">
          {/* Workspaces */}

          <div className="manage-card">
            <h3>Workspaces</h3>

            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="manage-existing-column"
              >
                <span>{ws.name}</span>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteWorkspace(ws.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Desks */}

          <div className="manage-card">
            <h3>Desks</h3>

            {desks.map((d) => (
              <div
                key={d.id}
                className="manage-existing-column"
              >
                <span>
                  {d.name || `Desk ${d.id}`}
                </span>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteDesk(d.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Rooms */}

          <div className="manage-card">
            <h3>Rooms</h3>

            {rooms.map((r) => (
              <div
                key={r.id}
                className="manage-existing-column"
              >
                <span>
                  {r.name || `Room ${r.id}`}
                </span>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteRoom(r.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WorkspaceManagement;