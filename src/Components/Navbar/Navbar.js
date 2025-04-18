import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { PiHashBold } from 'react-icons/pi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiVoiceprintLine} from 'react-icons/ri';
import './Navbar.css';

function Navbar() {
  const [width, setWidth] = useState(false);
  const [activeArrow, setActiveArrow] = useState(true);
  const [activeClose, setActiveClose] = useState(false);
  const [rotate, setRotate] = useState('');
  const [rotate2, setRotate2] = useState('');
  const [rotate3, setRotate3] = useState('');
  const [divHidden, setDivHidden] = useState(false);
  const [textHidden, setTexthidden] = useState(false);
  const [voiceHidden, setVoicehidden] = useState(false);

  const handleCloseActive = () => {
    setActiveClose(!activeClose);
  };

  const handleArrowActive = () => {
    setActiveArrow(!activeArrow);
  };

  const handleDivActive = () => {
    setWidth(!width);
    handleArrowActive();
    handleCloseActive();
    console.log(width);
  };

  const handleTitleOnClick = () => {
    setRotate(rotate === '' ? 'rotate-90' : '');
    setDivHidden(!divHidden);
  };
  const handleTextTitleOnClick = () => {
    setRotate2(rotate2 === '' ? 'rotate-90' : '');
    setTexthidden(!textHidden);
  };
  const handleVoiceChannelOnClick = () => {
    setRotate3(rotate3 === '' ? 'rotate-90' : '');
    setVoicehidden(!voiceHidden);
  };

  const handleChatRoomClick =()=>{
    window.location.href = 'https://dischat-chatroom.netlify.app/';
  }

  return (
    <div>
      <header className="header p-3 py-4 font-semibold text-white font-[poppins] flex items-center justify-between px-10 z-10">
          DisChat
        <div className="relative">
          <FaAngleDown
            onClick={handleDivActive}
            className={`cursor-pointer  font-[300] ${activeArrow ? '' : 'hidden'}`}
          />
          <IoMdClose
            onClick={handleDivActive}
            className={`close cursor-pointer  text-xl font-[300] ${activeClose ? '' : 'hidden'}`}
          />
          <div
            className={`absolute bg-[#121212] ${width?'w-[290px]':''} z-20 h-[300px] rounded-xl -right-5 top-12 ease-in-out duration-300 transition-transform`}
          ></div>
        </div>
      </header>
      <div className="bg-[#292a2e] h-[90vh] p-3 py-12">
        <div className="">
        
          <div className="flex items-center ">
            <MdKeyboardArrowRight
              className={`text-xl text-[#696c74] font-bold mr-1 ${rotate} transition-all duration-200 ease-in-out `}
            />
            <div onClick={handleTitleOnClick} className="cursor-pointer title w-[140px] relative flex items-center  px-1">
              <div className=""></div>
              <h1 className="text-[15px] text-[#696c74] font-[roboto] font-semibold uppercase">Information</h1>
            </div>
          </div>
          <div className={`${divHidden? 'hidden' : ''}  w-full h-[75px] mt-[5px]`}>
            <div className="ml-[30px] pt-2 flex flex-col">
              <div className="flex items-center mb-3 cursor-pointer hover:bg-[#acadb1]   w-60 p-2 rounded-lg">
                <PiHashBold className="text-2xl text-[#696c74] mr-3  " />
                <h1 className="font-[roboto] font-[450]  text-[#696c74] ">Rules-and-Regulations</h1>
              </div>
              <div className="flex items-center cursor-pointer hover:bg-[#acadb1]  w-60 p-2 rounded-lg">
                <PiHashBold className="text-2xl text-[#696c74] mr-3 " />
                <h1 className="font-[roboto] font-[450]  text-[#696c74]">Announcement</h1>
              </div>
            </div>
        </div>
        <div>
          <div className="flex items-center mt-16">
            <MdKeyboardArrowRight
              className={`text-xl text-[#696c74] font-bold mr-1 ${rotate2} transition-all duration-200 ease-in-out `}
            />
            <div onClick={handleTextTitleOnClick} className="cursor-pointer title w-[140px] relative flex items-center  px-1">
              <div className=""></div>
              <h1 className="text-[15px] text-[#696c74] font-[roboto] font-semibold uppercase">Text Channel</h1>
            </div>
          </div>
          <div className={`${textHidden? 'hidden' : ''} w-full h-[75px] mt-[4px]`}>
            <div className="ml-[30px] pt-2 flex flex-col cursor-pointer">
              <div className="flex items-center mb-2  cursor-pointer hover:bg-[#acadb1]  w-60 p-2 rounded-lg">
                <PiHashBold className="text-2xl text-[#696c74] mr-3 " />
                <h1 className="font-[roboto] font-[450]  text-[#696c74] ">General</h1>
              </div>
             
            </div>
           </div>

          <div className="flex items-center mt-[20px] text-xl">
            <MdKeyboardArrowRight
              className={`text-xl text-[#696c74] font-bold mr-1 ${rotate3} transition-all duration-200 ease-in-out `}
            />
            <div onClick={handleVoiceChannelOnClick} className="cursor-pointer title w-[140px] relative flex items-center  px-1 ">
              <div className=""></div>
              <h1 className="text-[15px] text-[#696c74] font-[roboto] font-semibold uppercase">Voice Channel</h1>
            </div>
          </div>
          <div className={`${voiceHidden ? 'hidden' : ''} w-full h-[75px] mt-[4px]`}>
            <div className="ml-[30px] pt-2 flex flex-col cursor-pointer">
              <div onClick={handleChatRoomClick} className="flex items-center mb-2  cursor-pointer hover:bg-[#acadb1]  w-60 p-2 rounded-lg">
                <RiVoiceprintLine className="text-2xl text-[#696c74] mr-3 " />
                <h1 className="font-[roboto] font-[450]  text-[#696c74] ">Chat room</h1>
              </div>
             
            </div>
           </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
