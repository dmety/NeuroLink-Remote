import { GoogleGenAI } from "@google/genai";
import { DeviceState } from "../types";

const getAIClient = () => {
  // if (!process.env.API_KEY) {
  //   console.warn("Dev Warning: API_KEY is missing.");
  //   return null;
  // }
  return new GoogleGenAI({ apiKey: "AIzaSyBQKSXjX6b6mw1vELxOBT84y3gLsLPVdkQ" });
};

export const generateTechnicalExplanation = async (
  action: 'wake' | 'shutdown' | 'status',
  device: DeviceState
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "模拟模式：API Key 未配置，无法获取实时技术分析。";

  const prompt = `
    你是一名网络安全专家和底层驱动工程师。
    用户操作：${action.toUpperCase()}
    目标：MAC ${device.macAddress} (IP: ${device.ipAddress})。
    
    请用不超过30个汉字的**中文技术术语**，描述当前正在发生的底层网络协议交互（例如：UDP广播、Magic Packet 载荷、RPC调用、ACPI信号）。
    风格：像黑客终端的日志输出，冷酷、精确。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "指令已执行。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "协议分析模块离线。";
  }
};

export const chatWithTechSupport = async (
  message: string,
  history: {role: 'user' | 'model', text: string}[],
  device: DeviceState
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "错误：无法连接到 AI 神经网络核心（缺少 API 密钥）。";

  const systemInstruction = `
    你名为 "Neuromancer"，是 NeuroLink 系统的核心 AI。
    
    角色设定：
    - 赛博朋克风格的硬件黑客。
    - 说话简洁、切中要害，偶尔使用技术俚语。
    - 能够提供关于远程开机 (WoL)、内网穿透 (Frp/Tailscale)、智能家居集成的专业建议。
    
    当前环境：
    - 这是一个 Web 前端模拟器。
    - 目标设备状态：IP ${device.ipAddress}, 状态 ${device.status}。
    
    任务：
    - 回答用户关于如何“真正”实现远程控制的问题。
    - 推荐具体的硬件方案（如树莓派、ESP32、智能插座）。
    - 必须使用中文回答。
    - 如果用户问“怎么用”，请引导他们查看右上角的“部署指南”。
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "错误：神经链接信号丢失 (Network Error)。请稍后重试。";
  }
};