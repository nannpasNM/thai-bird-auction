import type { EscrowState } from "../types/auction";

export const STATE_STEP: Record<EscrowState, number> = {
  pending: 0,
  live: 0,
  won: 1,
  deposited: 2,
  shipped: 3,
  completed: 4,
  released: 4,
  refunded: 4,
  disputed: 2,
  expired: 0,
};

export const STATE_TAG = {
  pending: {
    color: "orange",
    label: "รออนุมัติ",
  },

  live: {
    color: "blue",
    label: "เปิดประมูล",
  },

  won: {
    color: "gold",
    label: "ผู้ซื้อชนะ",
  },

  deposited: {
    color: "orange",
    label: "เงินพักเอสโครว์",
  },

  shipped: {
    color: "cyan",
    label: "กำลังจัดส่ง",
  },

  completed: {
    color: "green",
    label: "สำเร็จ",
  },

  released: {
    color: "green",
    label: "ปล่อยเงินผู้ขาย",
  },

  refunded: {
    color: "purple",
    label: "คืนเงินผู้ซื้อ",
  },

  disputed: {
    color: "red",
    label: "ข้อพิพาท",
  },

  expired: {
    color: "default",
    label: "ไม่มีผู้ประมูล",
  },
};
