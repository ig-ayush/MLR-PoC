import React from "react";
import { StyleSheet, Text, View } from "react-native";

function formatDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString();
}

export default function LeadCard({ lead }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{lead.name || "Unnamed lead"}</Text>
        <Text style={styles.time}>{formatDate(lead.createdAt)}</Text>
      </View>

      <Text style={styles.secondary}>
        {lead.email || "No email provided"}
      </Text>

      <Text style={styles.secondary}>
        {lead.phone || "No phone provided"}
      </Text>

      <Text style={styles.meta}>
        Meta ID: {lead.metaLeadId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e1e5ea",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#15191f"
  },
  time: {
    fontSize: 11,
    color: "#6b7280",
    maxWidth: 120,
    textAlign: "right"
  },
  secondary: {
    fontSize: 14,
    color: "#3d4652",
    marginTop: 5
  },
  meta: {
    fontSize: 11,
    color: "#8a93a0",
    marginTop: 9
  }
});
