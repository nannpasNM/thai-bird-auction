import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Layout,
  Segmented,
  Space,
  Typography,
  theme,
} from "antd";

import {
  ExperimentOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import LoginPage from "./components/LoginPage";

import PRDMode from "./components/PRDMode";

import SandboxMode from "./components/SandboxMode";

import { ROLE_DATA } from "./components/data/roleData";

import { fetchAuctionHistory, fetchAuctions } from "./services/auctionService";

import { mapAuction } from "./utils/mapAuction";

import type { Auction, Role } from "./components/types/auction";

const ROLE_META: Record<
  Role,
  {
    label: string;

    color: string;
  }
> = {
  buyer1: {
    label: "ผู้ซื้อ #1",

    color: "blue",
  },

  buyer2: {
    label: "ผู้ซื้อ #2",

    color: "cyan",
  },

  buyer3: {
    label: "ผู้ซื้อ #3",

    color: "geekblue",
  },

  seller: {
    label: "ผู้ขาย",

    color: "green",
  },

  expert: {
    label: "ผู้เชี่ยวชาญ",

    color: "purple",
  },

  middleman: {
    label: "ตัวกลางเอสโครว์",

    color: "red",
  },
};

function App() {
  const [mode, setMode] = useState<"sandbox" | "poc">("sandbox");

  const [buyerWallets, setBuyerWallets] = useState({
    buyer1: 50000,

    buyer2: 50000,

    buyer3: 50000,
  });

  const [sellerWallet, setSellerWallet] = useState(0);

  const [expertWallet, setExpertWallet] = useState(0);

  const [escrowVault, setEscrowVault] = useState(0);

  const [auctions, setAuctions] = useState<Auction[]>([]);
  useEffect(() => {
    console.log(
      "APP AUCTIONS",

      auctions.map((a) => ({
        id: a.id,

        state: a.state,
      })),
    );
  }, [auctions]);

  console.log("auctions", auctions);

  const [currentUser, setCurrentUser] = useState<{
    role: Role;

    name: string;
  }>();

  const loadAuctions = useCallback(async () => {
    try {
      const data = await fetchAuctions();

      const auctions = await Promise.all(
        data.map(async (item) => {
          const history = await fetchAuctionHistory(item.id);

          return {
            ...mapAuction(item),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            history: history.map((h: any) => ({
              actor: h.actor,
              action: h.action,
              at: h.created_at,
            })),
          };
        }),
      );

      setAuctions(auctions);
    } catch (error) {
      console.error("Load Auction Error:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAuctions();
  }, [loadAuctions]);

  const walletValue = useMemo(() => {
    switch (currentUser?.role) {
      case "buyer1":
        return buyerWallets.buyer1;

      case "buyer2":
        return buyerWallets.buyer2;

      case "buyer3":
        return buyerWallets.buyer3;

      case "seller":
        return sellerWallet;

      case "expert":
        return expertWallet;

      case "middleman":
        return escrowVault;

      default:
        return 0;
    }
  }, [
    currentUser?.role,

    buyerWallets,

    sellerWallet,

    expertWallet,

    escrowVault,
  ]);

  const profileDropdown = currentUser && (
    <Card
      bordered={false}
      style={{
        width: 300,

        borderRadius: 16,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Avatar size={90} src={ROLE_DATA[currentUser.role].image} />

        <Typography.Title
          level={5}
          style={{
            marginTop: 12,

            marginBottom: 4,
          }}
        >
          {currentUser.name}
        </Typography.Title>

        <Typography.Text type="secondary">
          {ROLE_META[currentUser.role].label}
        </Typography.Text>

        <Card
          size="small"
          style={{
            marginTop: 16,

            background: "#fafafa",
          }}
        >
          <Typography.Text type="secondary">ยอดเงินคงเหลือ</Typography.Text>

          <div
            style={{
              fontSize: 24,

              fontWeight: 700,

              color: "#d97706",
            }}
          >
            ฿{walletValue.toLocaleString()}
          </div>
        </Card>

        <Button
          danger
          block
          icon={<LogoutOutlined />}
          style={{ marginTop: 16 }}
          onClick={() => setCurrentUser(undefined)}
        >
          Logout
        </Button>
      </div>
    </Card>
  );

  if (!currentUser) {
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,

          token: {
            colorPrimary: "#d97706",

            borderRadius: 10,

            fontFamily:
              'system-ui, -apple-system, "Segoe UI", "Sarabun", sans-serif',
          },
        }}
      >
        <Layout
          style={{
            minHeight: "100vh",

            background: "#fffbf3",

            padding: 24,
          }}
        >
          <LoginPage
            onLogin={(role) =>
              setCurrentUser({
                role,

                name: ROLE_DATA[role].label,
              })
            }
          />
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,

        token: {
          colorPrimary: "#d97706",

          borderRadius: 10,

          fontFamily:
            'system-ui, -apple-system, "Segoe UI", "Sarabun", sans-serif',
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",

          background: "#fffbf3",
        }}
      >
        <Layout.Header
          style={{
            background: "#fff",

            borderBottom: "1px solid #f1e5cc",

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            padding: "0 24px",

            position: "sticky",

            top: 0,

            zIndex: 100,
          }}
        >
          <Space align="center">
            <img
              src="/image.png"
              alt="Bird Auction Logo"
              style={{
                width: 60,
                height: 60,
                marginTop: 40,
                objectFit: "contain",
              }}
            />

            <strong
              style={{
                fontSize: 20,

                fontWeight: 700,
              }}
            >
              Bird Auction & Escrow
            </strong>
          </Space>

          <Space size="large">
            <Segmented
              value={mode}
              onChange={(v) => setMode(v as "sandbox" | "poc")}
              options={[
                {
                  label: "Sandbox",

                  value: "sandbox",

                  icon: <ExperimentOutlined />,
                },

                {
                  label: "POC",

                  value: "poc",

                  icon: <FileTextOutlined />,
                },
              ]}
            />

            <Dropdown
              dropdownRender={() => profileDropdown}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Avatar
                size={42}
                src={ROLE_DATA[currentUser.role].image}
                style={{
                  cursor: "pointer",

                  border: "2px solid #f1e5cc",
                }}
              />
            </Dropdown>
          </Space>
        </Layout.Header>

        <Layout.Content
          style={{
            padding: 24,
          }}
        >
          {mode === "sandbox" ? (
            <SandboxMode
              role={currentUser.role}
              auctions={auctions}
              setAuctions={setAuctions}
              buyerWallets={buyerWallets}
              setBuyerWallets={setBuyerWallets}
              sellerWallet={sellerWallet}
              setSellerWallet={setSellerWallet}
              expertWallet={expertWallet}
              setExpertWallet={setExpertWallet}
              escrowVault={escrowVault}
              setEscrowVault={setEscrowVault}
              loadAuctions={loadAuctions}
            />
          ) : (
            <PRDMode />
          )}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
