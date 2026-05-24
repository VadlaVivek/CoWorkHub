import Navbar
from "../components/Navbar/Navbar"

import Sidebar
from "../components/Sidebar/Sidebar"

function DashboardLayout({
  children
}) {

  return (
    <div
      style={{
        display:"flex"
      }}
    >

      <Sidebar/>

      <div
        style={{
          flex:1
        }}
      >

        <Navbar/>

        <div
          style={{
            padding:"25px"
          }}
        >
          {children}
        </div>

      </div>
    </div>
  )
}

export default DashboardLayout