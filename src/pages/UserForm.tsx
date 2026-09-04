import { useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../api/axios";
import { createUser } from "../services/UserService.js";
import PasswordInput from "../components/PasswordInput";

const UserForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const user = { username, email, password, contact };

    createUser(user)
      .then(() => {
        toast.success("User created successfully.");
        setUsername("");
        setEmail("");
        setPassword("");
        setContact("");
      })
      .catch((error: unknown) => {
        toast.error(getApiErrorMessage(error, "Could not create user."));
      })
      .finally(() => {
        setSubmitting(false);
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
          <PasswordInput
            className="border border-black"
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
            value={submitting ? "Submitting..." : "Submit"}
            disabled={submitting}
            className="bg-black text-white mt-8 cursor-pointer disabled:opacity-60"
          />
        </form>
      </div>
    </>
  );
};

export default UserForm;
