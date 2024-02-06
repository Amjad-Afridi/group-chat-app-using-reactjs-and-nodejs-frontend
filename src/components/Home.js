import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { LuSend } from "react-icons/lu";
const socket = io("http://localhost:8080");
const Home = () => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageText.length === 0) return;
    socket.emit("message", { messageText, name });
    setMessageList([
      ...messageList,
      <li className="message-right">
        <p>
          {messageText} <br />
          <span> {new Date().toLocaleTimeString()}</span>
        </p>
      </li>,
    ]);
    setMessageText("");
  };

  const handleFocus = () => {
    socket.emit("typing", name);
  };
  const handleBlur = () => {
    socket.emit("not-typing");
  };
  socket.on("user-typing", (user) => {
    setIsTyping(true);
    console.log("user typing is ", user);
    setUserTyping(user);
  });
  socket.on("user-not-typing", () => {
    setIsTyping(false);
  });

  socket.on("receive-message", (message) => {
    setMessageList([
      ...messageList,
      <li className="message-left">
        <p>
          {message.messageText}
          <br />
          <span>
            {" "}
            {message.name} {new Date().toLocaleTimeString()}
          </span>
        </p>
      </li>,
    ]);
  });
  socket.on("user-name", (userData) => {
    setUsers([...users, userData]);
  });

  useEffect(() => {
    const userName = prompt("Enter your Name: ");
    setName(userName);
    socket.emit("set-users", userName);
  }, []);

  return (
    <>
      <div className="home-container-parent">
        <div className="home-container">
          <div className="left-side-menu">
            <div className="home-header">
              <img
                src="https://media-mct1-1.cdn.whatsapp.net/v/t61.24694-24/323815298_730542328625442_1734829861596065880_n.jpg?ccb=11-4&oh=01_AdRvj-t5YJsUER7rCTC8Y8qZPxSqejnUZ4LFGG9fh7wpWg&oe=65C9CE32&_nc_sid=e6ed6c&_nc_cat=108"
                width="40px"
                className="img-style"
              />{" "}
              <button className="icons-style">
                {" "}
                <BsThreeDotsVertical />{" "}
              </button>
            </div>
            <div className="search-members">
              <input className="search" placeholder="Search messages" />
              <IoSearch className="icons-style" />
            </div>
            <h3 className="group-members">Group Members</h3>

            {users.length > 0 &&
              users.map((user) => (
                <div className="singleUser">
                  <p> {user.userName}</p>
                  <p> {user.userId}</p>
                </div>
              ))}
          </div>
          <div className="right-side-menu">
            <div className="home-header">
              <div className="right-side-header-items">
                <img
                  src="https://th.bing.com/th/id/R.d82223e86bd03f7105e2cd5242ac1b8a?rik=IIWwoQj9azhieg&pid=ImgRaw&r=0"
                  alt="Group-img"
                  width="40px"
                  className="img-style"
                />
                <p>Friends</p>
              </div>
              <div className="right-side-header-items">
                <div className="icons-style">
                  {" "}
                  <IoSearch />{" "}
                </div>
                <button className="icons-style">
                  {" "}
                  <BsThreeDotsVertical />{" "}
                </button>
              </div>
            </div>
            <div className="container-body">
              <ul className="messages">
                {messageList.map((message) => message)}
              </ul>
              {isTyping && <p> {userTyping && userTyping} is typing</p>}
              <form onSubmit={sendMessage}>
                <div>
                  <input
                    type="text"
                    placeholder="Enter message"
                    value={messageText}
                    onChange={handleMessageChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <button>
                    {" "}
                    <LuSend />{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
