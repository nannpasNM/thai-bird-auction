export type Role =
  | "buyer1"
  | "buyer2"
  | "buyer3"
  | "seller"
  | "expert"
  | "middleman";

export type EscrowState =
  | "pending"
  | "live"
  | "won"
  | "deposited"
  | "shipped"
  | "completed"
  | "released"
  | "refunded"
  | "disputed"
  | "expired";

export type BuyerRole = "buyer1" | "buyer2" | "buyer3";
export interface Auction {
  id: string;
  name: string;
  breed: string;

  image?: string;

  basePrice: number;
  currentBid: number;

  bidder: string | null;

  winner?: BuyerRole;
  certified: boolean;

  certifyNote?: string;
  confidence?: number;

  state: EscrowState;

  history: {
    actor: string;
    action: string;
    at: string;
  }[];
}

export interface AuctionApi {
  id: number;
  name: string;
  breed: string;
  image: string;
  base_price: number;
  current_bid: number;
  bidder: string | null;
  certified: boolean;
  confidence?: number;
  certify_note?: string;
  state: EscrowState;
}
