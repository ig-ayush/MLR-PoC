import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLeads } from "../services/api";
import { createLeadsSocket } from "../services/socket";

function upsertNewestFirst(current, incomingLead) {
  const withoutDuplicate = current.filter(
    (lead) =>
      lead.id !== incomingLead.id &&
      lead.metaLeadId !== incomingLead.metaLeadId
  );

  return [incomingLead, ...withoutDuplicate];
}

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const socketRef = useRef(null);

  const loadInitialLeads = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load leads"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialLeads();

    const socket = createLeadsSocket();
    socketRef.current = socket;

    const onConnect = () => setConnectionState("connected");
    const onDisconnect = () => setConnectionState("disconnected");
    const onConnectError = () => setConnectionState("error");
    const onReconnectAttempt = () => setConnectionState("reconnecting");

    const onNewLead = (lead) => {
      setLeads((current) => upsertNewestFirst(current, lead));
    };

    setConnectionState("connecting");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.on("new-lead", onNewLead);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.off("new-lead", onNewLead);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadInitialLeads]);

  return {
    leads,
    loading,
    error,
    connectionState,
    retry: loadInitialLeads
  };
}
