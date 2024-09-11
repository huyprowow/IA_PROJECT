import React from "react";
import { Button, Divider, notification, Space } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { ArgsProps } from "antd/lib/notification";

const style = {
  width: 300,
  transition: "all 1.5s",
  borderRadius: 7,
};
export const notificationCustom = ({
  key,
  type,
  message,
  description,
}: ArgsProps) => {
  const content: ArgsProps = {
    message: message,
    description: description,
    placement: "bottomLeft",
    style: style,
  };
  if (key) content.key = key;
  switch (type) {
    case "success":
      notification.success({
        ...content,
        icon: <SmileOutlined style={{ color: "#52C41A" }} />,
      } as ArgsProps);
      break;
    case "error":
      notification.error({
        ...content,
        icon: <FrownOutlined style={{ color: "#F8444F" }} />,
      } as ArgsProps);
      break;
    case "warning":
      notification.warning({ ...content } as ArgsProps);
      break;
    case "info":
      notification.info({ ...content } as ArgsProps);
      break;
    default:
      break;
  }
};
