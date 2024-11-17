import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [img, setImg] = useState({ file: null, url: "" });
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [text]); // Run only once when the component mounts

  const handleEmoji = (e) => {
    setOpenEmoji(false);
    setText(text + e.emoji);
  };

  const handleSend = async () => {
    if (!text && !img.file) return;

    setLoading(true); // Start loader

    try {
      let imgUrl = null;

      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setImg({ file: null, url: "" });
      setLoading(false); // Stop loader
      inputRef.current.focus();
    }
  };

  const handleImg = async (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      setText(e.target.files[0].name);

      toast.info("Click send to upload the image");
    }
  };

  const handleTyping = (e) => {
    if (e.key === "Enter") {
      handleSend();
    } else {
      setText(e.target.value);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <h2>{user?.username} </h2>
            <p>{user?.lastMessage}</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message, i) => (
          <div
            className={
              message?.senderId === currentUser?.id ? "message own" : "message"
            }
            key={i}
          >
            {message?.senderId !== currentUser?.id && (
              <img src={user?.avatar || "/avatar.png"} alt="" />
            )}
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}
        {loading ? (
          <div className="loader">Sending...</div>
        ) : (
          img.url && (
            <div className="message">
              <div className="texts preview">
                <img src={img.url} alt="" />
                <button
                  className="sendButton"
                  onClick={handleSend}
                  disabled={
                    isCurrentUserBlocked || isRecieverBlocked || loading
                  }
                >
                  Send
                </button>
              </div>
            </div>
          )
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label
            htmlFor="file"
            className={
              isCurrentUserBlocked || isRecieverBlocked || loading
                ? "disabled"
                : ""
            }
          >
            <img src="/img.png" alt="" />
          </label>
          <input
            onChange={handleImg}
            type="file"
            id="file"
            style={{ display: "none" }}
            disabled={isCurrentUserBlocked || isRecieverBlocked || loading}
          />
          <img src="/camera.png" alt="" />
          <img src="/mic.png" alt="" />
        </div>
        <input
          ref={inputRef}
          value={text}
          disabled={isCurrentUserBlocked || isRecieverBlocked || loading}
          onKeyDown={handleTyping}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder={
            isCurrentUserBlocked || isRecieverBlocked
              ? "You can not send a message"
              : "Type a message"
          }
        />
        <div
          className={
            isCurrentUserBlocked || isRecieverBlocked || loading
              ? "disabled emoji"
              : "emoji"
          }
        >
          <img
            onClick={() => setOpenEmoji(!openEmoji)}
            src="/emoji.png"
            alt=""
          />
          {isCurrentUserBlocked || isRecieverBlocked || loading ? (
            ""
          ) : (
            <div className="picker">
              <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isRecieverBlocked || loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
