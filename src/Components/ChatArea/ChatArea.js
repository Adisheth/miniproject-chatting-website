import React from 'react'
import Navbar from "../Navbar/Navbar.js"
import {Chats,ChatMessage} from '../Chats/Chats.js'
import Participants from '../Participants/Participants.js'
function ChatArea() {
  return (
    <div className='flex  w-screen mt-2  rounded-tl-[10px]'>
      <div className="w-[20%] bg-[#292a2e] rounded-tl-[10px]">
      <Navbar/>
      </div>
      <div className="w-[80%] text-[#ebebeb] bg-[#313338]">
      <Chats/>
      </div>
     
    </div>
  )
}

export default ChatArea