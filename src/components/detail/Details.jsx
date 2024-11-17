import "./details.css";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Details = () => {
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", currentUser.id);

      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="details">
      <div className="user">
        <img src={user?.avatar || "/avatar.png"} alt="" />
        <h2>{user?.username} </h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/favicon.png" alt="" />
                <span>Photo.png</span>
              </div>
              <img src="/download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isRecieverBlocked
            ? "User Blocked"
            : "Block User"}{" "}
        </button>
        <button
          className="logout"
          onClick={() => {
            auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Details;
