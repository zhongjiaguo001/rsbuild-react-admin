// src/pages/chat/constants.ts
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ROLE_CONFIG = {
  user: {
    name: "您",
    avatar:
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png",
  },
  assistant: {
    name: "AI助手",
    avatar: "http://localhost:3000/uploads/ai/images/ai-bot.png",
  },
  system: {
    name: "系统",
    avatar:
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/system-icon.svg",
  },
};
