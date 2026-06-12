import { Form, Input, InputNumber, Modal, Space, Tag, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TEMPLATES } from "./data/auctionTemplates";

interface Props {
  open: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
}

export default function NewAuctionModal({ open, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="เปิดประมูลนกใหม่"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          try {
            const body = {
              name: values.name,
              breed: values.breed || "",
              base_price: values.basePrice || 0,
              image: values.image?.[0]?.name || "",
            };

            console.log("Request Body:", body);

            const res = await fetch("http://localhost:3000/createBirdAuction", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            await res.json();

            await onSubmit({});

            form.resetFields();
            onCancel();
          } catch (err) {
            console.error("Create Error:", err);
          }
        }}
      >
        {" "}
        <Space wrap>
          {TEMPLATES.map((t) => (
            <Tag
              key={t.name}
              color="orange"
              onClick={() => form.setFieldsValue(t)}
            >
              {t.name}
            </Tag>
          ))}
        </Space>
        <Form.Item name="name" label="ชื่อนก" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="breed" label="สายพันธุ์">
          <Input />
        </Form.Item>
        <Form.Item name="basePrice" label="ราคาเริ่มต้น">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="image"
          label="รูปนก"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>อัปโหลด</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
