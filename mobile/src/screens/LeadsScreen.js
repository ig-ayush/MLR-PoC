import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import LeadCard from "../components/LeadCard";
import { useLeads } from "../hooks/useLeads";

function ConnectionPill({ state }) {
  const labels = {
    connected: "Connected",
    connecting: "Connecting...",
    reconnecting: "Reconnecting...",
    disconnected: "Disconnected",
    error: "Connection error"
  };

  return (
    <View style={[styles.connectionPill, styles[`connection_${state}`] || null]}>
      <View style={styles.statusDot} />
      <Text style={styles.connectionText}>{labels[state] || state}</Text>
    </View>
  );
}

export default function LeadsScreen() {
  const { leads, loading, error, connectionState, retry } = useLeads();

  const header = (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.subtitle}>Real-time employee lead inbox</Text>
      </View>
      <ConnectionPill state={connectionState} />
    </View>
  );

  if (loading && leads.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.centerText}>Loading leads...</Text>
        </View>
      </View>
    );
  }

  if (error && leads.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Could not load leads</Text>
          <Text style={styles.centerText}>{error}</Text>
          <Text style={styles.retryText} onPress={retry}>
            Tap here to retry
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}

      {error ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={leads}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LeadCard lead={item} />}
        contentContainerStyle={[
          styles.listContent,
          leads.length === 0 ? styles.emptyContent : null
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={retry} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No leads yet</Text>
            <Text style={styles.centerText}>
              Submit a Meta test lead and keep this screen open.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fb"
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#12161c"
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#69717d"
  },
  connectionPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  connection_connected: {
    backgroundColor: "#e8f7ee"
  },
  connection_connecting: {
    backgroundColor: "#fff5d9"
  },
  connection_reconnecting: {
    backgroundColor: "#fff5d9"
  },
  connection_disconnected: {
    backgroundColor: "#f2f3f5"
  },
  connection_error: {
    backgroundColor: "#fdecec"
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#26a65b",
    marginRight: 6
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#344054"
  },
  listContent: {
    padding: 14,
    paddingBottom: 28
  },
  emptyContent: {
    flexGrow: 1
  },
  banner: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    padding: 10
  },
  bannerText: {
    fontSize: 12,
    color: "#a52a2a"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28
  },
  centerText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#69717d",
    textAlign: "center"
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#a52a2a"
  },
  retryText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "700",
    color: "#1d4ed8"
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#20242a"
  }
});
