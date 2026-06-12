import {
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
} from "antd";

const { Title, Paragraph } = Typography;

const POC_STEPS = [
  {
    title: "ขั้นที่ 1 — 🐓 ผู้ขาย",
    items: [
      'กด "เปิดประมูลใหม่"',
      'เลือกเทมเพลต "นกกรงหัวจุก ตัวผู้"',
      "ยืนยันการสร้างรายการ",
      "สถานะเป็น รออนุมัติ (Pending)",
    ],
  },

  {
    title: "ขั้นที่ 2 — 👮 ตัวกลาง (Middleman)",
    items: [
      'กด "อนุมัติเปิดประมูล"',
      "สถานะเปลี่ยนเป็น เปิดประมูล",
      "ผู้ซื้อสามารถเริ่มสู้ราคาได้",
    ],
  },

  {
    title: "ขั้นที่ 3 — 🎓 ผู้เชี่ยวชาญ (ทางเลือก)",
    items: [
      'กด "เปิดแผงวินิจฉัย"',
      "กำหนดความมั่นใจ 90%",
      'กด "ออกตราเซอร์ + รับ ฿1,000"',
      "ราคาตั้งต้นและราคาปัจจุบันเพิ่ม 2 เท่า",
      "ผู้เชี่ยวชาญได้รับค่าตอบแทน ฿1,000",
      "รายการติดป้าย Certified",
    ],
  },

  {
    title: "ขั้นที่ 4 — 🛍️ ผู้ซื้อ",
    items: [
      'กด "สู้ราคา +฿500"',
      "แข่งขันเสนอราคาหลายรอบ",
      "Timeline บันทึกทุกการเสนอราคา",
      "ระบบแสดงผู้นำราคาปัจจุบัน",
    ],
  },

  {
    title: "ขั้นที่ 5 — 👮 ตัวกลาง",
    items: [
      "ตรวจสอบการประมูล",
      'กด "ปิดประมูล"',
      "ผู้เสนอราคาสูงสุดกลายเป็นผู้ชนะ",
      "สถานะเปลี่ยนเป็น ผู้ซื้อชนะ",
    ],
  },

  {
    title: "ขั้นที่ 6 — 🛍️ ผู้ซื้อ",
    items: [
      'กด "ชำระมัดจำเข้าเอสโครว์"',
      "เงินถูกย้ายเข้าตู้เซฟ Escrow",
      "ยอดเงินผู้ซื้อถูกหัก",
      "สถานะเปลี่ยนเป็น เงินพักเอสโครว์",
    ],
  },

  {
    title: "ขั้นที่ 7 — 🐓 ผู้ขาย",
    items: ['กด "ยืนยันจัดส่งนก"', "สถานะเปลี่ยนเป็น กำลังจัดส่ง"],
  },

  {
    title: "ขั้นที่ 8A — Happy Path",
    items: [
      '🛍️ ผู้ซื้อกด "ยืนยันรับนก"',
      "Escrow ปล่อยเงินให้ผู้ขาย",
      "ยอดเงินผู้ขายเพิ่มขึ้น",
      "สถานะเปลี่ยนเป็น สำเร็จ",
    ],
  },

  {
    title: "ขั้นที่ 8B — Dispute Path",
    items: [
      '🛍️ ผู้ซื้อกด "เปิดข้อพิพาท"',
      "สถานะเปลี่ยนเป็น ข้อพิพาท",
      "ตัวกลางเข้าตรวจสอบ",
      'เลือก "คืนเงินผู้ซื้อ"',
      "หรือ",
      'เลือก "ปล่อยเงินผู้ขาย"',
    ],
  },
];

const PROOFS = [
  {
    key: "1",
    value: "เงินไม่ถูกเบี้ยว",
    proof: "ตู้เซฟเอสโครว์กรอบแดงแสดงยอดถือครองเงินตลอดกระบวนการ",
  },
  {
    key: "2",
    value: "ผู้เชี่ยวชาญสร้างมูลค่า",
    proof: "ราคาเพิ่ม 2 เท่าหลัง Certified และได้รับค่าธรรมเนียม ฿1,000",
  },
  {
    key: "3",
    value: "ตรวจสอบย้อนหลังได้",
    proof: "Timeline แสดงผู้กระทำ รายการ และเวลาของทุกเหตุการณ์",
  },
  {
    key: "4",
    value: "มีทางออกเมื่อเกิดข้อพิพาท",
    proof: "ตัวกลางสามารถคืนเงินผู้ซื้อหรือปล่อยเงินผู้ขายได้ทันที",
  },
];

export default function PRDMode() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="🎯 Proof of Concept (POC)">
          <Title level={4}>
            ผู้ขายเปิดประมูล → ผู้ซื้อชนะ → เอสโครว์ → จัดส่ง → ปล่อยเงิน
          </Title>

          <Paragraph type="secondary">
            ตัวอย่าง Workflow ที่สามารถทดลองได้จริงบน Sandbox Mode
          </Paragraph>

          <Divider />

          <Timeline
            items={[
              {
                color: "orange",
                children: "ผู้ขายสร้างรายการประมูล",
              },
              {
                color: "red",
                children: "ตัวกลางอนุมัติเปิดประมูล",
              },
              {
                color: "purple",
                children: "ผู้เชี่ยวชาญรับรอง (Optional)",
              },
              {
                color: "blue",
                children: "ผู้ซื้อแข่งขันเสนอราคา",
              },
              {
                color: "red",
                children: "ตัวกลางปิดประมูล",
              },
              {
                color: "gold",
                children: "ผู้ซื้อชนะการประมูล",
              },
              {
                color: "orange",
                children: "ชำระเงินเข้า Escrow",
              },
              {
                color: "cyan",
                children: "ผู้ขายจัดส่งนก",
              },
              {
                color: "green",
                children: "ยืนยันรับสินค้า → ปล่อยเงิน",
              },
              {
                color: "red",
                children: "หรือ เปิดข้อพิพาท → ตัวกลางตัดสิน",
              },
            ]}
          />

          <Divider />

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {POC_STEPS.map((step) => (
              <Card key={step.title} size="small" title={step.title}>
                <List
                  size="small"
                  dataSource={step.items}
                  renderItem={(item) => <List.Item>• {item}</List.Item>}
                />
              </Card>
            ))}
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="🔎 จุดที่ POC พิสูจน์ได้">
          <Table
            pagination={false}
            rowKey="key"
            dataSource={PROOFS}
            columns={[
              {
                title: "คุณค่าที่อ้างในระบบ",
                dataIndex: "value",
                render: (v) => <Tag color="blue">{v}</Tag>,
              },
              {
                title: "หลักฐานบนหน้าจอ",
                dataIndex: "proof",
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}
