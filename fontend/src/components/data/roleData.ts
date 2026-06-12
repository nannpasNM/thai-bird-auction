import type { Role } from "../types/auction";

export const ROLE_DATA: Record<
  Role,
  {
    label: string;
    desc: string;
    image: string;
  }
> = {
  buyer1: {
    label: "ผู้ซื้อ #1",
    desc: "ผู้ซื้อคนที่ 1",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
  },

  buyer2: {
    label: "ผู้ซื้อ #2",
    desc: "ผู้ซื้อคนที่ 2",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
  },

  buyer3: {
    label: "ผู้ซื้อ #3",
    desc: "ผู้ซื้อคนที่ 3",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
  },

  seller: {
    label: "ผู้ขาย",
    desc: "ผู้เสนอขายสินค้า",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
  },

  expert: {
    label: "ผู้เชี่ยวชาญ",
    desc: "ผู้ให้คำแนะนำและข้อมูล",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=5",
  },

  middleman: {
    label: "ตัวกลาง",
    desc: "ผู้ประสานงานระหว่างผู้ซื้อและผู้ขาย",
    image: "https://api.dicebear.com/7.x/miniavs/svg?seed=6",
  },
};
