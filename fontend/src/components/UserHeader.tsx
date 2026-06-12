import { Button, Card, Space, Tag } from "antd";

interface Props {
  name: string;
  wallet: number;
  onLogout: () => void;
}

export default function UserHeader({ name, wallet, onLogout }: Props) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Tag color="blue">{name}</Tag>

          <strong>💰 ฿{wallet.toLocaleString()}</strong>
        </Space>

        <Button danger onClick={onLogout}>
          Logout
        </Button>
      </Space>
    </Card>
  );
}
