import "./profile.scss";
import profileImage from "../../assets/avatar.svg";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile__wrapper bg">
      <div className="profile__container bg__accent">
        <div className="avatar">
          <img src={profileImage} alt="not found" />
        </div>
        <div className="table__wrapper">
          <table>
            <tr>
              <th>First Name</th>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <th>Middle Name</th>
              <td>{user?.middleName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{user?.lastName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user?.email}</td>
            </tr>

            <tr>
              <th>Role</th>
              <td>{user?.role}</td>
            </tr>

            <tr>
              <th>Account Status</th>
              <td>{user?.accountStatus}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
