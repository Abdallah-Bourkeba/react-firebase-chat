import "./list.css";
import UserInfo from "../list/userInfo/UserInfo";
import ChatList from "../list/chatList/ChatList";

const List = () => {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
