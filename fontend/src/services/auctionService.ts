import type { AuctionApi } from "../components/types/auction";

export const fetchAuctions = async (): Promise<AuctionApi[]> => {
  const res = await fetch("http://localhost:3000/searchBirdAuction");

  return res.json();
};

export const createAuctionHistory = async (
  auctionId: string,
  actor: string,
  action: string,
  state?: string,
) => {
  const res = await fetch("http://localhost:3000/createAuctionHistory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auction_id: auctionId,
      actor,
      action,
      state,
    }),
  });

  return res.json();
};

export const fetchAuctionHistory = async (auctionId: number) => {
  const res = await fetch(`http://localhost:3000/auctionHistory/${auctionId}`);

  return res.json();
};
