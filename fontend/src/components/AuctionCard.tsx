import {
  CheckCircleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  List,
  Modal,
  Space,
  Steps,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from "antd";

import { useMemo, useState } from "react";

import {
  STATE_STEP,
  STATE_TAG,
} from "../../src/components/constants/auctionState";

import type { Auction, Role } from "../components/types/auction";

interface Props {
  auction: Auction;

  role: Role;

  actions: {
    approveAuction: (auction: Auction) => void;

    placeBid: (auction: Auction) => void;

    winAuction: (auction: Auction) => void;

    payDeposit: (auction: Auction) => void;

    shipBird: (auction: Auction) => void;

    confirmReceive: (auction: Auction) => void;

    openDispute: (auction: Auction) => void;

    refund: (auction: Auction) => void;

    release: (auction: Auction) => void;

    certify: (
      auction: Auction,

      confidence: number,

      note: string,
    ) => void;
  };
}

export default function AuctionCard({ auction: a, role, actions }: Props) {
  const [certOpen, setCertOpen] = useState(false);

  const [conf, setConf] = useState(85);

  const [note, setNote] = useState("สุขภาพดี เสียงร้องคม");

  const tag = STATE_TAG[a.state];

  console.log("STATE =", a.state);

  console.log("TAG =", STATE_TAG[a.state]);

  console.log("AUCTION =", a);

  const isBuyer = useMemo(
    () => ["buyer1", "buyer2", "buyer3"].includes(role),
    [role],
  );

  const isOwnerBuyer = a.winner === role;

  const bidCount = useMemo(
    () => a.history.filter((h) => h.action.includes("สู้ราคา")).length,
    [a.history],
  );

  const participantCount = useMemo(
    () =>
      new Set(
        a.history
          .filter((h) => h.actor.includes("ผู้ซื้อ"))
          .map((h) => h.actor),
      ).size,
    [a.history],
  );

  const canBid = isBuyer && a.state === "live";
  const canCloseAuction = role === "middleman" && a.state === "live";
  const canPayDeposit = isOwnerBuyer && a.state === "won";

  const canConfirmReceive = isOwnerBuyer && a.state === "shipped";

  const canShip = role === "seller" && a.state === "deposited";

  const canCertify = role === "expert" && !a.certified;

  const canResolveDispute = role === "middleman" && a.state === "disputed";

  const canApproveAuction = role === "middleman" && a.state === "pending";

  const latestHistory = [...a.history].reverse().slice(0, 5);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <Card
        title={
          <Space>
            <Avatar
              style={{
                background: "#fef3c7",
              }}
            >
              🐦
            </Avatar>

            <span>{a.name}</span>

            {a.certified && (
              <Tooltip title={`รับรอง ${a.confidence}% • ${a.certifyNote}`}>
                <Tag icon={<SafetyCertificateOutlined />} color="purple">
                  Certified
                </Tag>
              </Tooltip>
            )}
          </Space>
        }
        extra={<Tag color={tag.color}>{tag.label}</Tag>}
      >
        {/* IMAGE */}

        <div
          style={{
            width: "100%",
            height: 300,
            borderRadius: 8,
            marginBottom: 12,
            background: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={a.image}
            alt={a.name}
            style={{
              width: "100%",
              height: 300,
              objectFit: "contain",
            }}
          />
        </div>

        {/* DETAILS */}

        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="รหัส">{a.id}</Descriptions.Item>

          <Descriptions.Item label="สายพันธุ์">{a.breed}</Descriptions.Item>

          <Descriptions.Item label="ราคาเริ่ม">
            ฿{a.basePrice.toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="ราคาปัจจุบัน">
            <strong
              style={{
                color: "#d97706",
                fontSize: 18,
              }}
            >
              ฿{a.currentBid.toLocaleString()}
            </strong>
          </Descriptions.Item>

          <Descriptions.Item label="ผู้นำราคา">
            <Tag color="gold">{a.bidder ?? "ยังไม่มีผู้เสนอราคา"}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="จำนวน Bid">
            <Tag color="blue">{bidCount} ครั้ง</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="สถานะ">
            <Tag color={tag.color}>{tag.label}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="ผู้เข้าร่วม">
            <Tag color="green">{participantCount} คน</Tag>
          </Descriptions.Item>
        </Descriptions>

        {/* PROGRESS */}

        <Steps
          size="small"
          current={STATE_STEP[a.state]}
          status={a.state === "disputed" ? "error" : undefined}
          style={{
            marginTop: 16,
            marginBottom: 16,
          }}
          items={[
            { title: "ประมูล" },
            { title: "ชนะ" },
            { title: "เอสโครว์" },
            { title: "จัดส่ง" },
            { title: "จบ" },
          ]}
        />

        <Divider />

        {/* ACTIONS */}

        <Space wrap>
          {canBid && (
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => actions.placeBid(a)}
            >
              สู้ราคา +฿500
            </Button>
          )}

          {canCloseAuction && (
            <Button onClick={() => actions.winAuction(a)}>
              ปิดประมูล (จำลอง)
            </Button>
          )}

          {canPayDeposit && (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => actions.payDeposit(a)}
            >
              ชำระมัดจำเข้าเอสโครว์
            </Button>
          )}

          {canConfirmReceive && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => actions.confirmReceive(a)}
              >
                ยืนยันรับนก
              </Button>

              <Button
                danger
                icon={<WarningOutlined />}
                onClick={() => actions.openDispute(a)}
              >
                เปิดข้อพิพาท
              </Button>
            </>
          )}

          {role === "seller" && a.state === "pending" && (
            <Alert
              type="warning"
              showIcon
              message="รอตัวกลางอนุมัติเปิดประมูล"
            />
          )}

          {role === "seller" && a.state === "live" && !a.certified && (
            <Tag color="default">รอผู้เชี่ยวชาญรับรอง</Tag>
          )}

          {canApproveAuction && (
            <Button type="primary" onClick={() => actions.approveAuction(a)}>
              อนุมัติเปิดประมูล
            </Button>
          )}

          {canShip && (
            <Button type="primary" onClick={() => actions.shipBird(a)}>
              ยืนยันจัดส่งนก
            </Button>
          )}

          {canCertify && (
            <Button type="primary" onClick={() => setCertOpen(true)}>
              เปิดแผงวินิจฉัย
            </Button>
          )}

          {canResolveDispute && (
            <>
              <Button onClick={() => actions.refund(a)}>คืนเงินผู้ซื้อ</Button>

              <Button type="primary" onClick={() => actions.release(a)}>
                ปล่อยเงินผู้ขาย
              </Button>
            </>
          )}

          {role === "middleman" && !canResolveDispute && (
            <Badge status="processing" text="ตรวจสอบธุรกรรมอัตโนมัติ" />
          )}
        </Space>

        {/* TIMELINE */}

        <Divider plain>กิจกรรมล่าสุด ({a.history.length})</Divider>

        <Timeline
          items={latestHistory.map((h) => ({
            children: (
              <Space direction="vertical" size={0}>
                <Space>
                  <Tag>{h.actor}</Tag>
                  <span>{h.action}</span>
                </Space>

                <Typography.Text type="secondary">{h.at}</Typography.Text>
              </Space>
            ),
          }))}
        />

        {a.history.length > 5 && (
          <Button type="link" size="small" onClick={() => setHistoryOpen(true)}>
            ดูทั้งหมด
          </Button>
        )}

        {/* CERTIFY MODAL */}

        <Modal
          title={`แผงวินิจฉัยสุขภาพ — ${a.name}`}
          open={certOpen}
          onCancel={() => setCertOpen(false)}
          onOk={() => {
            actions.certify(a, conf, note);

            setCertOpen(false);
          }}
          okText="ออกตราเซอร์ + รับ ฿1,000"
        >
          <List
            size="small"
            dataSource={[
              "ดวงตาใส ไม่ขุ่นมัว",
              "ปีกแข็งแรง ขนเรียงสวย",
              "เสียงร้องริก คมชัด",
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined
                  style={{
                    color: "#16a34a",
                    marginRight: 8,
                  }}
                />
                {item}
              </List.Item>
            )}
          />

          <div style={{ marginTop: 12 }}>
            <div>ความมั่นใจ (%)</div>

            <InputNumber
              min={0}
              max={100}
              value={conf}
              onChange={(v) => setConf(v ?? 0)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <div>ข้อเสนอแนะ</div>

            <Input.TextArea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Alert
            showIcon
            type="info"
            style={{
              marginTop: 12,
            }}
            message="การออกตราเซอร์จะอัปเกรดราคาเริ่มต้นเป็น 2 เท่า"
          />
        </Modal>
      </Card>
      <Modal
        title={`ประวัติการประมูล - ${a.name}`}
        open={historyOpen}
        footer={null}
        onCancel={() => setHistoryOpen(false)}
        width={700}
      >
        <Timeline
          items={[...a.history].reverse().map((h) => ({
            children: (
              <Space direction="vertical" size={0}>
                <Space>
                  <Tag>{h.actor}</Tag>
                  <span>{h.action}</span>
                </Space>

                <span
                  style={{
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  {h.at}
                </span>
              </Space>
            ),
          }))}
        />
      </Modal>
    </>
  );
}
