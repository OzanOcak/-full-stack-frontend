import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams(); //path

  const user = useSelector((state) => selectUserById(state, id));
  // fetch from redux instead of from db

  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

  return content;
};
export default EditUser;
