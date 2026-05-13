import axios from "axios";

const url = "http://localhost:8080/api/users";

export const createUser = (user) => axios.post(url, user);

export const getAllUsers = () => axios.get(url);

export const getUserById = (id) => axios.get(url + "/" + id);

export const updateUser = (id, user) => axios.put(url + "/" + id, user);

export const deleteUser = (id) => axios.delete(url + "/" + id);
