import profileImage from "../../assets/avatar.svg";
import { useState } from "react";
import { BASE_URL, getUserDetails } from "../../http";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const UserDetail = () => {
  const [user, setUser] = useState({});
  const { _id } = useParams();
  const fetchUserDetails = async () => {
    try {
      const { data } = await getUserDetails(_id);
      setUser(data?.user);
      setImage(
        data?.user?.imagePath
          ? `${BASE_URL}/${data?.user?.imagePath}`
          : profileImage
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [image, setImage] = useState(
    user?.imagePath ? `${BASE_URL}/${user?.imagePath}` : profileImage
  );

  return (
    <div className="profile__wrapper bg">
      <div className="profile__container bg__accent">
        <div className="avatar">
          <img src={image} alt="not found" />
        </div>

        <div className="table__wrapper">
          <table>
            <tr>
              <th>First Name</th>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{user?.lastName}</td>
            </tr>
            {user?.role === "Teacher" && (
              <tr>
                <th>Email</th>
                <td>{user?.email}</td>
              </tr>
            )}

            {user?.role === "Student" && (
              <>
                <tr>
                  <th>Roll Number</th>
                  <td>{user?.rollNumber}</td>
                </tr>

                <tr>
                  <th>Batch</th>
                  <td>{user?.batch?.startingYear}</td>
                </tr>
              </>
            )}

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

export default UserDetail;
