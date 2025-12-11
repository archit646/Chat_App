import React, { useState, useEffect, useRef } from "react";

function App() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [state, setState] = useState('Connect')
  const msgEndRef = useRef(null);
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])



  const clientRef = useRef(null)
  const startConnection = () => {
    
    if (!name.trim() || !room.trim()) {
      return alert("Please enter Name and Room")
    }
    setState('Connecting...')

    clientRef.current = new WebSocket(`wss://web-chat-3ezl.onrender.com/ws/${room}/`)
    // clientRef.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}${room}/`);
    clientRef.current.onopen = () => {
      console.log('Connected Successfully')
      setState('Connected')
    }
    clientRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setMessages((old) => [...old, data])
    }
    clientRef.current.onerror = (e) => {
      console.log("Error:", e)
    }
     clientRef.current.onclose = () => {
    console.log("Connection closed. Reconnecting...");
    setState("Connecting...");
       startConnection();   // auto reconnect
  };
  }


  const sendMessage = () => {
    if (text.trim() != '') {
      clientRef.current.send(JSON.stringify({
        type: 'message',
        message: text,
        sender: name
      }))
      setText('')


    }
  }
  return (
    <>
      <div className="w-[90%] m-auto h-screen flex items-center justify-center">
        {state === 'Connected' ?
          <div className=" bg-black h-[60vh] sm:h-[90vh] w-full p-4 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white justify-center items-center flex">Chat Room:<p className="text-red-600">{state==='Connecting...'?state: room }</p></h1>
            <div className=" h-[95%] overflow-y-scroll flex gap-2 flex-col bg-white p-2">

              {messages.map((msg, i) =>

                <p key={i} className={`wrap-break-word max-w-[60%] inline-block py-1 px-3 rounded-lg text-white ${msg.sender === name ? 'self-end bg-blue-800' : 'self-start bg-green-800'}`}><b className="text-yellow-200">{msg.sender}</b>:{msg.message}</p>)}
              <div ref={msgEndRef}></div>
            </div>
            <div className=" flex w-full gap-2">
              <textarea placeholder="Text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { e.key === 'Enter' ? sendMessage() : null }} className="border p-1 w-[85%] placeholder:text-xl bg-white outline-none"></textarea>
              <button className="bg-blue-500 px-5 py-1 text-white rounded-sm w-[15%] flex justify-center items-center font-semibold" onClick={sendMessage}>Send</button>
            </div>
          </div>
          : <div className="flex flex-col bg-gray-400 p-5 items-center gap-2 rounded-xl">
            <h2 className="text-xl font-bold text-blue-700 ">Enter Details</h2>
            <input placeholder="Name" value={name} className="border p-1 bg-white outline-none" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { e.key === 'Enter' ? startConnection() : null }}></input>
            <input placeholder="Room" value={room} className="border p-1 bg-white outline-none" onChange={(e) => setRoom(e.target.value)} onKeyDown={(e) => { e.key === 'Enter' ? startConnection() : null }}></input>
            {/* <button className="bg-blue-500 px-5 text-white rounded-lg" onClick={() => setFilledForm(true)}>{ clientRef.current.readyState===WebSocket.CONNECTING?'Connecting...':'Join'}</button> */}
            <button className={`bg-blue-500 px-5 py-1 text-white rounded-lg ${state === 'Connecting...' ? 'cursor-not-allowed opacity-50' : ''}`} onClick={startConnection}> {state}</button>



          </div>
        }
      </div>
    </>


  )
}

export default App;
