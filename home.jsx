import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

const logo = require("../../assets/images/main-logo.png");
const profileImage = require("../../assets/images/person.png");

const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return "Maayong Buntag,";
  if (hour >= 11 && hour < 13) return "Maayong Udto,";
  if (hour >= 13 && hour < 18) return "Maayong Hapon,";

  return "Maayong Gabie,";
};

const getFormattedDate = () => {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
};

const formatComplaintDate = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusDisplay = (status) => {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "for_validation") return "For Validation";
  if (status === "completed") return "Completed";

  return "Pending";
};

const getStatusStyle = (status) => {
  if (status === "in_progress") return "progress";
  if (status === "completed") return "completed";
  if (status === "pending") return "pending";
  if (status === "for_validation") return "validation";

  return "pending";
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const [greeting, setGreeting] = useState(getTimeGreeting());
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  const [dashboardCounts, setDashboardCounts] = useState({
    pending: 0,
    in_progress: 0,
    for_validation: 0,
    completed: 0,
  });

  const [complaints, setComplaints] = useState([]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const fetchDashboardData = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User error:", userError?.message);
      return;
    }

    const { data, error } = await supabase
      .from("complaints")
      .select("id, title, location, status, created_at")
      .eq("citizen_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Complaint fetch error:", error.message);
      return;
    }

    const counts = {
      pending: 0,
      in_progress: 0,
      for_validation: 0,
      completed: 0,
    };

    data.forEach((complaint) => {
      if (complaint.status === "pending") counts.pending += 1;
      if (complaint.status === "in_progress") counts.in_progress += 1;
      if (complaint.status === "for_validation") counts.for_validation += 1;
      if (complaint.status === "completed") counts.completed += 1;
    });

    setDashboardCounts(counts);
    setComplaints(data.slice(0, 3));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getTimeGreeting());
      setCurrentDate(getFormattedDate());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let channel;

    const setupRealtimeDashboard = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("Realtime user error:", userError?.message);
        return;
      }

      await fetchDashboardData();

      channel = supabase
        .channel("citizen-dashboard-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "complaints",
            filter: `citizen_id=eq.${user.id}`,
          },
          () => {
            fetchDashboardData();
          }
        )
        .subscribe();
    };

    setupRealtimeDashboard();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchDashboardData]);

  if (!fontsLoaded) return null;

  const horizontalPadding = 18;
  const gap = 8;
  const cardWidth = (width - horizontalPadding * 2 - gap * 3) / 4;

  const brandLogoSize = width < 380 ? 58 : 88;
  const brandTextSize = width < 380 ? 25 : 35;

  const dashboardData = [
    {
      id: 1,
      title: "Pending",
      count: dashboardCounts.pending,
      icon: "time-outline",
    },
    {
      id: 2,
      title: "In Progress",
      count: dashboardCounts.in_progress,
      icon: "sync-outline",
    },
    {
      id: 3,
      title: "For\nValidation",
      count: dashboardCounts.for_validation,
      icon: "person-outline",
    },
    {
      id: 4,
      title: "Completed",
      count: dashboardCounts.completed,
      icon: "checkmark-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image
              source={logo}
              resizeMode="contain"
              style={[
                styles.brandLogo,
                {
                  width: brandLogoSize,
                  height: brandLogoSize,
                },
              ]}
            />

            <View style={styles.brandTextRow}>
              <Text
                style={[
                  styles.brandTextDark,
                  {
                    fontSize: brandTextSize,
                    lineHeight: brandTextSize + 5,
                  },
                ]}
              >
                Citi
              </Text>

              <Text
                style={[
                  styles.brandTextLight,
                  {
                    fontSize: brandTextSize,
                    lineHeight: brandTextSize + 5,
                  },
                ]}
              >
                Sense
              </Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.profileButton}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingSmall}>{greeting}</Text>
          <Text style={styles.greetingBig}>Bogohanon!</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.dashboardSectionTitle}>Dashboard</Text>

          <TouchableOpacity activeOpacity={0.7} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={17} color="#7B8278" />
          </TouchableOpacity>
        </View>

        <View style={styles.dashboardRow}>
          {dashboardData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.dashboardCard,
                {
                  width: cardWidth,
                  marginRight: index !== dashboardData.length - 1 ? gap : 0,
                },
              ]}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={25} color="#FFFFFF" />
              </View>

              <Text style={styles.dashboardTitle}>{item.title}</Text>
              <Text style={styles.dashboardCount}>{item.count}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionHeader, styles.complaintHeader]}>
          <Text style={styles.complaintSectionTitle}>My Complaints</Text>

          <TouchableOpacity activeOpacity={0.7} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={17} color="#7B8278" />
          </TouchableOpacity>
        </View>

        <View style={styles.complaintsList}>
          {complaints.length === 0 ? (
            <View style={styles.emptyComplaintCard}>
              <Text style={styles.emptyComplaintText}>
                No complaints submitted yet.
              </Text>
            </View>
          ) : (
            complaints.map((item) => {
              const statusStyle = getStatusStyle(item.status);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={styles.complaintCard}
                >
                  <View style={styles.complaintLeft}>
                    <Text style={styles.complaintTitle}>{item.title}</Text>

                    <View style={styles.infoRow}>
                      <Ionicons
                        name="location-sharp"
                        size={15}
                        color="#596157"
                      />
                      <Text style={styles.infoText}>{item.location}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="calendar" size={15} color="#596157" />
                      <Text style={styles.infoText}>
                        {formatComplaintDate(item.created_at)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.complaintRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        statusStyle === "progress" && styles.progressBadge,
                        statusStyle === "completed" && styles.completedBadge,
                        statusStyle === "pending" && styles.pendingBadge,
                        statusStyle === "validation" && styles.validationBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          statusStyle === "progress" && styles.progressText,
                          statusStyle === "completed" && styles.completedText,
                          statusStyle === "pending" && styles.pendingText,
                          statusStyle === "validation" && styles.validationText,
                        ]}
                      >
                        {getStatusDisplay(item.status)}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="#7A8178"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color="#0A760A" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={24} color="#111111" />
          <Text style={styles.navText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={24} color="#111111" />
          <Text style={styles.navText}>My Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#111111" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={24} color="#111111" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingTop: 8,
    paddingBottom: 105,
    backgroundColor: "#FFFFFF",
  },

  header: {
    width: "100%",
    minHeight: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  brandLogo: {
    marginLeft: -6,
    marginRight: 0,
  },

  brandTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8,
  },

  brandTextDark: {
    fontFamily: "Poppins_700Bold",
    color: "#0A760A",
    includeFontPadding: false,
  },

  brandTextLight: {
    fontFamily: "Poppins_700Bold",
    color: "#87C542",
    includeFontPadding: false,
  },

  profileButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    backgroundColor: "#DDE8F7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  profileImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },

  greetingContainer: {
    marginTop: 8,
    paddingBottom: 2,
  },

  greetingSmall: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#0A760A",
    lineHeight: 28,
    includeFontPadding: true,
  },

  greetingBig: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 38,
    color: "#0A760A",
    lineHeight: 50,
    marginTop: 0,
    includeFontPadding: true,
  },

  dateText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#7B8278",
    marginTop: 6,
    letterSpacing: 0.3,
    includeFontPadding: true,
  },

  sectionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },

  dashboardSectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#0A760A",
  },

  complaintSectionTitle: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 25,
    color: "#0A760A",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#7B8278",
    marginRight: 1,
  },

  dashboardRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dashboardCard: {
    minHeight: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 11,
    paddingHorizontal: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0A760A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  dashboardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#0A760A",
    textAlign: "center",
    lineHeight: 14,
    minHeight: 32,
  },

  dashboardCount: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 28,
    color: "#0A760A",
    lineHeight: 33,
    marginTop: 5,
  },

  complaintHeader: {
    marginTop: 22,
  },

  complaintsList: {
    gap: 10,
  },

  complaintCard: {
    width: "100%",
    minHeight: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  emptyComplaintCard: {
    width: "100%",
    minHeight: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    paddingHorizontal: 13,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyComplaintText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#7B8278",
  },

  complaintLeft: {
    flex: 1,
    paddingRight: 8,
  },

  complaintTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#41493E",
    marginBottom: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  infoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11.5,
    color: "#596157",
    marginLeft: 7,
  },

  complaintRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusBadge: {
    minWidth: 94,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  statusText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 11.5,
  },

  progressBadge: {
    backgroundColor: "#FFECA8",
  },

  progressText: {
    color: "#C09100",
  },

  completedBadge: {
    backgroundColor: "#D6E9D5",
  },

  completedText: {
    color: "#0A760A",
  },

  pendingBadge: {
    backgroundColor: "#D7E3FF",
  },

  pendingText: {
    color: "#2E55A4",
  },

  validationBadge: {
    backgroundColor: "#E8DBFF",
  },

  validationText: {
    color: "#6B3FB8",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 7,
    paddingBottom: 10,
    paddingHorizontal: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 9.2,
    color: "#111111",
    marginTop: 3,
    textAlign: "center",
    includeFontPadding: false,
  },

  activeNavText: {
    fontFamily: "Poppins_700Bold",
    color: "#0A760A",
  },
});
