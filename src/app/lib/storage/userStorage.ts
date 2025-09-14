import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export type Role = "admin" | "guest";

export type User = {
  id: string;
  username: string;
  password?: string;
  role: Role;
};

// Sửa đường dẫn để trỏ đến thư mục 'data' ở thư mục gốc của dự án
const DATA_FILE = path.join(process.cwd(), "data", "users.json");

const readData = (): User[] => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error instanceof Error && (error as any).code === "ENOENT") {
      const defaultUsers = [{ id: nanoid(), username: "admin", password: "password123", role: "admin" }];
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    console.error("Lỗi khi đọc dữ liệu người dùng:", error);
    return [];
  }
};

const writeData = (data: User[]) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export const getUsers = (): User[] => {
  const users = readData();
  return users.map(({ password, ...rest }) => rest);
};

export const findUserByUsername = (username: string): User | undefined => {
  const users = readData();
  return users.find((u) => u.username === username);
};

export const createUser = (user: Omit<User, "id">): User => {
  const users = readData();
  const newUser = { id: nanoid(), ...user };
  users.push(newUser);
  writeData(users);
  return newUser;
};

export const updateUser = (id: string, update: Partial<User>): User | undefined => {
  const users = readData();
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) return undefined;
  
  const updatedUser = { ...users[userIndex], ...update };
  users[userIndex] = updatedUser;
  writeData(users);
  return updatedUser;
};

export const deleteUser = (id: string) => {
  const users = readData();
  const filteredUsers = users.filter((u) => u.id !== id);
  writeData(filteredUsers);
};