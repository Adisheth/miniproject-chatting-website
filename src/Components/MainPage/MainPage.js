import React from 'react'
import Sidebar from '../SIdeBar/SideBar.js'
import ChatArea from '../ChatArea/ChatArea'

function MainScreen() {
  return (
    <div className={`flex`}>
        <Sidebar/>
        <ChatArea/>
    </div>
  )
}

export default MainScreen