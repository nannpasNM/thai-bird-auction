import type {
  Auction,
  AuctionApi,
  EscrowState,
} from "../components/types/auction";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapAuction = (item: AuctionApi): Auction => ({
  id: String(item.id),
  name: item.name || "",
  breed: item.breed || "",

  image: item.image
    ? item.image.startsWith("http")
      ? item.image
      : `/images/${item.image}`
    : "",

  basePrice: Number(item.base_price || 0),

  currentBid:
    Number(item.current_bid) > 0
      ? Number(item.current_bid)
      : Number(item.base_price || 0),

  bidder: item.bidder || null,

  winner: undefined,
  certified: Boolean(item.certified),

  confidence: item.confidence ?? undefined,
  certifyNote: item.certify_note ?? undefined,

  state: (item.state?.trim()?.toLowerCase() || "pending") as EscrowState,
  history: [],
});
