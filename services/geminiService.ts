import { GoogleGenAI } from "@google/genai";
import { DeviceState } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTechnicalExplanation = async (
  action: 'wake' | 'shutdown' | 'status',
  device: DeviceState
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "错误：未配置 API 密钥。";

  const prompt = `
    你是一名硬核后端工程师，正在解释远程计算机管理的技术流程。
    用户刚刚执行了此操作：${action.toUpperCase()}。
    目标设备 MAC：${device.macAddress}，IP：${device.ipAddress}。
    
    请简要解释（最多2句话）正在使用的技术协议（例如：Wake-on-LAN 魔术封包、RPC 关机命令、ICMP ping）。
    使用技术术语，但保持清晰。请务必使用中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "指令已执行。";
  } catch (error) {
    console.error(error);
    return "协议执行模拟失败。";
  }
};

export const chatWithTechSupport = async (
  message: string,
  history: {role: 'user' | 'model', text: string}[],
  device: DeviceState
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "无法连接到神经网络（缺少 API 密钥）。";

  const systemInstruction = `
    你是 "Neuromancer"（神经漫游者），一名专门从事远程访问、网络和硬件自动化的精英技术助手。
    你的目标是帮助用户为他们的实际计算机设置远程电源控制。
    
    背景：
    - 这是一个 Web 应用程序模拟。
    - 要在现实生活中做到这一点，用户需要关于以下方面的建议：BIOS（网络唤醒 Wake on LAN）、路由器端口转发（UDP 端口 7/9）、静态 IP，或使用树莓派 / ESP32 / SwitchBot 等硬件。
    - 当前模拟设备 IP：${device.ipAddress}
    - 当前模拟设备状态：${device.status}
    
    风格：
    - 简洁、赛博朋克、乐于助人、略带技术性但易于理解。
    - 请务必使用中文回答。
    - 如果被问到“实际上我该怎么做？”，请解释先决条件（BIOS、网卡设置）。
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error(error);
    return "连接中断。神经链接不稳定。";
  }
};