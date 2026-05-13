import { useEffect, useState } from "react";
import { getAllUsers } from "../services/UserService.js";

const ListUsers = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    getAllUsers()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <h2>LIST OF USERS</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>username</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {user.map((value) => (
            <tr key={value.id}>
              <td>{value.id}</td>
              <td>{value.username}</td>
              <td>{value.email}</td>
              <td>{value.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
