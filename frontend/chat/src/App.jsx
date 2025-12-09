import React, { useState, useEffect, useRef } from "react";

function App() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [filledForm, setFilledForm] = useState(false)
  const clientRef = useRef(null)
  useEffect(() => {
    if (filledForm) {
      clientRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/${room}/`)
      clientRef.current.onopen = () => {
        console.log('Connected Successfully')
      }
      clientRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data)
        setMessages((old)=>[...old,data])
      }
      clientRef.current.onerror = (e) => {
        console.log("Error:",e)
      }
     return ()=>clientRef.current.onclose()
    }
    
  }, [filledForm])
  const sendMessage = () => {
    if (text.trim() != '') {
      clientRef.current.send(JSON.stringify({
        type: 'message',
        message: text,
        sender:name
      }))
      setText('')
    }
  }
  return (
    <>
      <div className="w-[90%] m-auto h-screen flex items-center justify-center">
        {filledForm?
          <div className=" bg-black h-full w-full p-4 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white justify-center items-center flex">Chat Room:<p className="text-red-600">{ room }</p></h1>
            <div className=" h-[95%] flex gap-2 flex-col bg-white p-2">

              {messages.map((msg, i) =>
                
                <p key={i} className={` inline-block py-1 px-3 rounded-full text-white ${msg.sender===name ?'self-end bg-blue-800':'self-start bg-green-800'}`}><b>{msg.sender}</b>:{msg.message}</p>)}
             
               </div>
            <div className=" flex w-full gap-2">
              <input placeholder="Text" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{e.key==='Enter'?sendMessage():null}} className="border p-1 w-[90%] bg-white outline-none"></input>
              <button className="bg-blue-500 px-5 py-1 text-white rounded-sm w-[10%]" onClick={sendMessage}>Send</button>
              </div>
          </div>
          : <div className="flex flex-col bg-gray-400 p-5 items-center gap-2 rounded-xl">
            <h2 className="text-xl font-bold text-blue-700 ">Enter Details</h2>
            <input placeholder="Name" value={name} className="border p-1 bg-white outline-none" onChange={(e)=>setName(e.target.value)} onKeyDown={(e)=>{e.key==='Enter'?setFilledForm(true):null}}></input>
            <input placeholder="Room" value={room} className="border p-1 bg-white outline-none" onChange={(e)=>setRoom(e.target.value)} onKeyDown={(e)=>{e.key==='Enter'?setFilledForm(true):null}}></input>
            <button className="bg-blue-500 px-5 text-white rounded-lg" onClick={()=>setFilledForm(true)}>Join</button>
          </div>
        }
    </div>
    </>

  
)
}

export default App;
