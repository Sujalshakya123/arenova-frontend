import { useEffect, useRef, useState } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { type ChatMessage, wsBrokerUrl } from "../services/chatApi";

type UseStompChatOptions = {
  topic: string | null;
  enabled: boolean;
  onMessage: (message: ChatMessage) => void;
};

const parseChatPayload = (body: string): ChatMessage | null => {
  try {
    const parsed = JSON.parse(body) as ChatMessage & {
      sentAt?: string | number[];
    };
    if (!parsed?.id || !parsed.body) return null;

    if (Array.isArray(parsed.sentAt)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = parsed.sentAt;
      parsed.sentAt = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
      ).toISOString();
    }

    return parsed as ChatMessage;
  } catch {
    return null;
  }
};

export const useStompChat = ({
  topic,
  enabled,
  onMessage,
}: UseStompChatOptions) => {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || !topic) {
      setConnected(false);
      setConnectError(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setConnectError("Login required for live chat.");
      setConnected(false);
      return;
    }

    const client = new Client({
      brokerURL: wsBrokerUrl(token),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnected(true);
        setConnectError(null);
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = client.subscribe(topic, (frame: IMessage) => {
          const parsed = parseChatPayload(frame.body);
          if (parsed) onMessageRef.current(parsed);
        });
      },
      onStompError: (frame) => {
        setConnectError(frame.headers.message || "Chat connection failed.");
        setConnected(false);
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
      onWebSocketError: () => {
        setConnectError("Live connection error. Retrying…");
        setConnected(false);
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [enabled, topic]);

  return { connected, connectError };
};
