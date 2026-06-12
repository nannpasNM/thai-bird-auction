import { useState, type Dispatch, type SetStateAction } from "react";
import { Button, Col, Row, message } from "antd";

import AuctionCard from "./AuctionCard";
import NewAuctionModal from "./NewAuctionModal";

import { createAuctionHistory } from "../services/auctionService";

import type { Auction, Role } from "./types/auction";

type BuyerRole = "buyer1" | "buyer2" | "buyer3";

const BUYER_META = {
  buyer1: { name: "ผู้ซื้อ #1", emoji: "🛍️" },
  buyer2: { name: "ผู้ซื้อ #2", emoji: "💰" },
  buyer3: { name: "ผู้ซื้อ #3", emoji: "🔥" },
} as const;

const isBuyerRole = (role: Role): role is BuyerRole =>
  ["buyer1", "buyer2", "buyer3"].includes(role);

const now = () => new Date().toLocaleTimeString("th-TH");

interface Props {
  role: Role;

  auctions: Auction[];
  setAuctions: Dispatch<SetStateAction<Auction[]>>;

  buyerWallets: Record<BuyerRole, number>;
  setBuyerWallets: Dispatch<SetStateAction<Record<BuyerRole, number>>>;

  sellerWallet: number;
  setSellerWallet: Dispatch<SetStateAction<number>>;

  expertWallet: number;
  setExpertWallet: Dispatch<SetStateAction<number>>;

  escrowVault: number;
  setEscrowVault: Dispatch<SetStateAction<number>>;

  loadAuctions: () => Promise<void>;
}

export default function SandboxMode({
  role,
  auctions,
  setAuctions,
  buyerWallets,
  setBuyerWallets,
  setSellerWallet,
  setExpertWallet,
  setEscrowVault,
  loadAuctions,
}: Props) {
  const [newOpen, setNewOpen] = useState(false);

  const buyerWallet = isBuyerRole(role) ? buyerWallets[role] : 0;

  const updateAuction = async (
    id: string,
    patch: Partial<Auction>,
    log?: {
      actor: string;
      action: string;
    },
  ) => {
    try {
      if (log) {
        await createAuctionHistory(id, log.actor, log.action, patch.state);
      }

      setAuctions((prev) =>
        prev.map((auction) =>
          auction.id === id
            ? {
                ...auction,
                ...patch,
                history: log
                  ? [...auction.history, { ...log, at: now() }]
                  : auction.history,
              }
            : auction,
        ),
      );
    } catch (error) {
      console.error("Update Auction Error:", error);
    }
  };

  const approveAuction = (auction: Auction) =>
    updateAuction(
      auction.id,
      { state: "live" },
      {
        actor: "Middleman",
        action: "อนุมัติเปิดประมูล",
      },
    );

  const placeBid = (auction: Auction) => {
    if (!isBuyerRole(role)) return;

    const nextBid = auction.currentBid + 500;

    if (nextBid > buyerWallet) {
      return message.error("เงินไม่พอ");
    }

    if (auction.winner === role) {
      return message.warning("คุณเป็นผู้นำราคาอยู่แล้ว");
    }

    const buyer = BUYER_META[role];

    updateAuction(
      auction.id,
      {
        currentBid: nextBid,
        bidder: buyer.name,
        winner: role,
      },
      {
        actor: buyer.name,
        action: `${buyer.emoji} สู้ราคา ฿${nextBid.toLocaleString()}`,
      },
    );
  };

  const winAuction = (auction: Auction) => {
    if (role !== "middleman") return;

    if (!auction.bidder) {
      return updateAuction(
        auction.id,
        { state: "expired" },
        {
          actor: "Middleman",
          action: "ปิดประมูล ไม่มีผู้เสนอราคา",
        },
      );
    }

    updateAuction(
      auction.id,
      { state: "won" },
      {
        actor: "Middleman",
        action: `ปิดประมูล ผู้ชนะ ${auction.bidder}`,
      },
    );
  };

  const payDeposit = (auction: Auction) => {
    if (auction.state !== "won") {
      return message.error("ยังไม่อยู่สถานะชำระเงิน");
    }

    if (auction.winner !== role) {
      return message.error("ไม่ใช่ผู้ชนะการประมูล");
    }

    const winner = auction.winner;

    if (!isBuyerRole(winner)) return;

    const amount = auction.currentBid;

    if (buyerWallets[winner] < amount) {
      return message.error("เงินไม่พอ");
    }

    setBuyerWallets((prev) => ({
      ...prev,
      [winner]: prev[winner] - amount,
    }));

    setEscrowVault((prev) => prev + amount);

    updateAuction(
      auction.id,
      { state: "deposited" },
      {
        actor: BUYER_META[winner].name,
        action: `ชำระเอสโครว์ ฿${amount.toLocaleString()}`,
      },
    );
  };

  const shipBird = (auction: Auction) => {
    if (auction.state !== "deposited") {
      return message.error("ต้องรอชำระเอสโครว์ก่อน");
    }

    updateAuction(
      auction.id,
      { state: "shipped" },
      {
        actor: "Seller",
        action: "จัดส่งนก",
      },
    );
  };

  const confirmReceive = (auction: Auction) => {
    if (auction.state !== "shipped") {
      return message.error("ยังไม่สามารถยืนยันรับได้");
    }

    if (auction.winner !== role) {
      return message.error("ไม่มีสิทธิ์ยืนยันรับสินค้า");
    }

    const amount = auction.currentBid;

    setEscrowVault((prev) => prev - amount);
    setSellerWallet((prev) => prev + amount);

    updateAuction(
      auction.id,
      { state: "completed" },
      {
        actor: BUYER_META[role].name,
        action: "ยืนยันรับนก",
      },
    );
  };

  const openDispute = (auction: Auction) => {
    if (auction.state !== "shipped") {
      return message.error("ยังไม่สามารถเปิดข้อพิพาท");
    }

    if (auction.winner !== role) {
      return message.error("ไม่มีสิทธิ์เปิดข้อพิพาท");
    }

    updateAuction(
      auction.id,
      { state: "disputed" },
      {
        actor: BUYER_META[role].name,
        action: "เปิดข้อพิพาท",
      },
    );
  };

  const refund = (auction: Auction) => {
    if (auction.state !== "disputed") return;

    const amount = auction.currentBid;
    const winner = auction.winner;

    setEscrowVault((prev) => prev - amount);

    if (winner && isBuyerRole(winner)) {
      setBuyerWallets((prev) => ({
        ...prev,
        [winner]: prev[winner] + amount,
      }));
    }

    updateAuction(
      auction.id,
      { state: "refunded" },
      {
        actor: "Middleman",
        action: "คืนเงินผู้ซื้อ",
      },
    );
  };

  const release = (auction: Auction) => {
    if (auction.state !== "disputed") return;

    const amount = auction.currentBid;

    setEscrowVault((prev) => prev - amount);
    setSellerWallet((prev) => prev + amount);

    updateAuction(
      auction.id,
      { state: "released" },
      {
        actor: "Middleman",
        action: "ปล่อยเงินผู้ขาย",
      },
    );
  };

  const certify = (auction: Auction, confidence: number, note: string) => {
    setExpertWallet((prev) => prev + 1000);

    updateAuction(
      auction.id,
      {
        certified: true,
        confidence,
        certifyNote: note,
        currentBid: auction.currentBid * 2,
        basePrice: auction.basePrice * 2,
      },
      {
        actor: "Expert",
        action: `รับรอง ${confidence}%`,
      },
    );
  };

  const actions = {
    approveAuction,
    placeBid,
    winAuction,
    payDeposit,
    shipBird,
    confirmReceive,
    openDispute,
    refund,
    release,
    certify,
  };

  const addAuction = async () => {
    await loadAuctions();
    setNewOpen(false);
  };

  return (
    <>
      {role === "seller" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px 0 16px",
          }}
        >
          <Button type="primary" onClick={() => setNewOpen(true)}>
            + เปิดประมูล
          </Button>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {auctions.map((auction) => (
          <Col key={auction.id} xs={24} lg={12}>
            <AuctionCard auction={auction} role={role} actions={actions} />
          </Col>
        ))}
      </Row>

      <NewAuctionModal
        open={newOpen}
        onCancel={() => setNewOpen(false)}
        onSubmit={addAuction}
      />
    </>
  );
}
