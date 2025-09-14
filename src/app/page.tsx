// src/app/page.tsx
import React from "react";
import AuthenticatedContent from "./_client/AuthenticatedContent";
import BroadcastMessage from "./_client/BroadcastMessage";
import { fileStorage } from "@lib/storage/fileStorage";
import { getBroadcasts } from "@lib/storage/broadcastStorage";

export default async function HomePage() {
  const categories = fileStorage.getCategories();
  const activeBroadcast = getBroadcasts().find(b => b.isActive);
  
  return (
    <>
      {activeBroadcast && <BroadcastMessage message={activeBroadcast.message} />}
      <AuthenticatedContent categories={categories} />
    </>
  );
}