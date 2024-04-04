import ContactList from "../../../components/Contact_List/ContactList";
import ChatList from "../../../components/Chat_List/ChatList.jsx";

const page = () => {
  return (
    <div className="lg:px-10 lg:pt-6 md:pt-6 pt-2 pb-1 lg:mb-20  px-2 ">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full flex justify-center items-start">
        <ChatList />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:hidden flex justify-center">
        <ContactList />
      </div>
    </div>
  );
};

export default page;
