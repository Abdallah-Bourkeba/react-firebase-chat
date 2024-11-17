import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const username = formData
        .get("username")
        .toLowerCase()
        .replace(/\s/g, "");

      const usersRef = collection(db, "users");

      const q = query(usersRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null);
        toast.error("User not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUser = async () => {
    try {
      const chatRef = collection(db, "chats");
      const userChatRef = collection(db, "userchats");

      const newChatRef = doc(chatRef);

      if (user.id === currentUser.id)
        return toast.error("Failed to add Yourself.");
      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      toast.success("User added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Enter user name" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="user" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
