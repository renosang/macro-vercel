// src/app/lib/storage/broadcastStorage.ts
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export type Broadcast = {
  id: string;
  message: string;
  isActive: boolean;
};

const DATA_FILE = path.join(process.cwd(), "data", "broadcast.json");

const readData = (): Broadcast[] => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error instanceof Error && (error as any).code === "ENOENT") {
      const defaultData: Broadcast[] = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    console.error("Lỗi khi đọc dữ liệu thông báo:", error);
    return [];
  }
};

const writeData = (data: Broadcast[]) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export const getBroadcasts = (): Broadcast[] => {
  return readData();
};

export const createBroadcast = (message: string): Broadcast => {
  const broadcasts = readData();
  // Vô hiệu hóa tất cả các thông báo cũ
  broadcasts.forEach(b => b.isActive = false);
  const newBroadcast = {
    id: nanoid(),
    message,
    isActive: true,
  };
  broadcasts.push(newBroadcast);
  writeData(broadcasts);
  return newBroadcast;
};

export const updateBroadcastStatus = (id: string, isActive: boolean) => {
  const broadcasts = readData();
  const index = broadcasts.findIndex(b => b.id === id);
  if (index === -1) return;

  if (isActive) {
    // Nếu kích hoạt thông báo mới, vô hiệu hóa tất cả các thông báo khác
    broadcasts.forEach(b => b.isActive = false);
    broadcasts[index].isActive = true;
  } else {
    broadcasts[index].isActive = false;
  }
  writeData(broadcasts);
};

export const deleteBroadcast = (id: string) => {
  const broadcasts = readData();
  const filteredBroadcasts = broadcasts.filter(b => b.id !== id);
  writeData(filteredBroadcasts);
};