import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import { useState } from "react";
import { ROLE_DATA } from "./data/roleData";
import type { Role } from "./types/auction";

const { Title, Text } = Typography;

interface Props {
  onLogin: (role: Role) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [role, setRole] = useState<Role>("buyer1");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 750,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="/image.png"
            alt="Bird Auction Sandbox"
            style={{
              width: 200,

              height: 200,

              objectFit: "contain",
            }}
          />

          <Title level={2}>ระบบประมูลซื้อขายนก</Title>

          <Text type="secondary">เลือกบทบาทเพื่อทดลองระบบประมูลนก</Text>
        </div>

        <Row gutter={[16, 16]}>
          {Object.entries(ROLE_DATA).map(([value, item]) => (
            <Col xs={24} md={12} lg={8} key={value}>
              <Card
                hoverable
                onClick={() => setRole(value as Role)}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  border:
                    role === value ? "2px solid #1677ff" : "1px solid #f0f0f0",
                  background: role === value ? "#e6f4ff" : "#fff",
                }}
              >
                <Space direction="vertical">
                  <Avatar
                    size={90}
                    src={item.image}
                    style={{
                      border:
                        role === value
                          ? "3px solid #1677ff"
                          : "3px solid #f0f0f0",
                    }}
                  />
                  <strong>{item.label}</strong>

                  <Text type="secondary">{item.desc}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Button
          type="primary"
          size="large"
          block
          style={{
            marginTop: 24,
            height: 50,
            fontWeight: 600,
          }}
          onClick={() => onLogin(role)}
        >
          เข้าสู่ระบบ
        </Button>
      </Card>
    </div>
  );
}
