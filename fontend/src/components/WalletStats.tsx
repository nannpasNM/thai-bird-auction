import { Avatar, Card, Flex, Statistic, Typography } from "antd";
import { ROLE_DATA } from "./data/roleData";
import type { Role } from "./types/auction";

const { Text } = Typography;

interface Props {
  role: Role;
  buyerWallet: number;
  sellerWallet: number;
  expertWallet: number;
  escrowVault: number;
}

export default function WalletStats({
  role,
  buyerWallet,
  sellerWallet,
  expertWallet,
  escrowVault,
}: Props) {
  const roleInfo = ROLE_DATA[role];

  const getTitle = () => {
    switch (role) {
      case "buyer1":
      case "buyer2":
      case "buyer3":
        return "กระเป๋าผู้ซื้อ";

      case "seller":
        return "กระเป๋าผู้ขาย";

      case "expert":
        return "กระเป๋าผู้เชี่ยวชาญ";

      default:
        return "ตู้เซฟเอสโครว์";
    }
  };

  const getValue = () => {
    switch (role) {
      case "buyer1":
      case "buyer2":
      case "buyer3":
        return buyerWallet;

      case "seller":
        return sellerWallet;

      case "expert":
        return expertWallet;

      default:
        return escrowVault;
    }
  };

  return (
    <Card>
      <Flex align="center" gap={16}>
        <Avatar size={64} src={roleInfo.image} />

        <div style={{ flex: 1 }}>
          <Text type="secondary">{roleInfo.label}</Text>

          <Statistic
            title={getTitle()}
            value={getValue()}
            prefix="฿"
            valueStyle={{
              color: role === "middleman" ? "#dc2626" : "#1677ff",
            }}
          />
        </div>
      </Flex>
    </Card>
  );
}
