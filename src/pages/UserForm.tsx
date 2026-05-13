import { useState } from "react";
import { createUser } from "../services/UserService.js";

const UserForm = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [contact, setContact] = useState();

  function handleFormSubmit(e) {
    e.preventDefault();

    const user = { username, email, password, contact };

    createUser(user)
      .then((response) => {
        console.log("ADDED TO DATABASE");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div>
        <h2 className="text-4xl">User Form</h2>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4 px-[80px] py-[20px]"
        >
          <label>Username</label>
          <input
            className="border border-black"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            className="border border-black"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            className="border border-black"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Contact</label>
          <input
            className="border border-black"
            type="text"
            placeholder="Enter contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <input
            type="submit"
            value="Submit"
            className="bg-black text-white mt-8 cursor-pointer"
          />
        </form>
      </div>
    </>
  );
};

export default UserForm;
