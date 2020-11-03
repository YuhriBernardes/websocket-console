import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useWebsocket, { ReadyState } from "react-use-websocket"
import { WebSocketHook } from "react-use-websocket/dist/lib/types"

const stateMapper = {
  [ReadyState.CLOSED]: "CLOSED",
  [ReadyState.CLOSING]: "CLOSING",
  [ReadyState.CONNECTING]: "CONNECTING",
  [ReadyState.OPEN]: "OPEN",
  [ReadyState.UNINSTANTIATED]: "UNINSTANTIATED",
}

function App() {
  const [connUrl, _] = useState("wss://echo.websocket.org")
  const [enableConn, setEnableConn] = useState(false)
  const [msgs, setMessages] = useState<string[]>([])
  const {
    lastMessage,
    readyState,
    sendMessage,
  }: WebSocketHook<MessageEvent<string>> = useWebsocket(connUrl, {}, enableConn)

  useEffect(() => {
    readyState === ReadyState.OPEN &&
      setMessages([...msgs, lastMessage?.data || "nop"])
  }, [lastMessage])

  const connect = () => setEnableConn(true)

  const close = () => {
    setEnableConn(false)
  }

  const send = () => sendMessage("Hello")

  return (
    <>
      <h1>{stateMapper[readyState]}</h1>
      <button disabled={readyState === ReadyState.OPEN} onClick={connect}>
        Connect
      </button>
      <button onClick={close}>Close</button>
      <button disabled={readyState !== ReadyState.OPEN} onClick={send}>
        Send
      </button>
      {msgs.map((v, idx) => (
        <p key={idx}>{v}</p>
      ))}
    </>
  )
}

export default App
