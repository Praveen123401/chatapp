import { useChatStore } from "../store/useChatStore";
import { useDashboardColorStore } from "../store/useDashboardColorStore";
import Sidebar from "../components/Sidebar";
import NochatSelected from "../components/NochatSelected";
import ChatContainer from "../components/Chatcontainer";
import GroupChatContainer from "../components/GroupChatContainer";
import "../styles/HomePage.css";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();
  const { dashboardColor } = useDashboardColorStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-dashboard-color", dashboardColor);
  }, [dashboardColor]);

  return (
    <div className="home-page">
      <div className="chat-dashboard">
        <Sidebar />
        <div className="chat-main">
          {!selectedUser && !selectedGroup && <NochatSelected />}
          {selectedUser && <ChatContainer />}
          {selectedGroup && <GroupChatContainer />}
        </div>
      </div>
    </div>
  );
};
export default HomePage;

// import { useChatStore } from "../Store/useChatStore"; 
// import Sidebar from "../components/Sidebar";

// import NoChatSelected from "../components/NochatSelected";
// import ChatContainer from "../components/Chatcontainer";


// const HomePage = () => {
//   const { selectedUser } = useChatStore();

//   return (
//     <div className="h-screen bg-base-200">
//       <div className="flex items-center justify-center pt-20 px-4">
//         <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
//           <div className="flex h-full rounded-lg overflow-hidden">
//             <Sidebar />
//             {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
