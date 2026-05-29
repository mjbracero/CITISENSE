import { ComponentProps } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const logo = require("../../assets/images/horizontal-logo.png");

type IconName = ComponentProps<typeof Ionicons>["name"];

const dashboardCards: {
  id: string;
  label: string;
  count: number;
  icon: IconName;
}[] = [
  {
    id: "pending",
    label: "Pending",
    count: 2,
    icon: "time",
  },
  {
    id: "progress",
    label: "In Progress",
    count: 1,
    icon: "sync",
  },
  {
    id: "validated",
    label: "Validated",
    count: 4,
    icon: "checkmark-circle",
  },
];

const complaints: {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
  icon: IconName;
}[] = [
  {
    id: "1",
    title: "Streetlight Not Working",
    location: "Purok Hongkong, Libertad",
    date: "May 4, 2026",
    status: "Pending",
    icon: "bulb",
  },
  {
    id: "2",
    title: "Garbage Collection Missed",
    location: "Purok Flores, San Vicente",
    date: "May 7, 2026",
    status: "In Progress",
    icon: "trash",
  },
  {
    id: "3",
    title: "Road with Potholes",
    location: "Purok Jose, Dakit",
    date: "May 23, 2026",
    status: "Validated",
    icon: "construct",
  },
];

export default function CitizenHomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <Ionicons name="person-circle" size={34} color="#0A760A" />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingSmall}>Maayong Buntag,</Text>
          <Text style={styles.greetingName}>Bogohanon!</Text>
          <Text style={styles.dateText}>THURSDAY, MAY 28</Text>
        </View>

        <Text style={styles.sectionTitle}>Dashboard</Text>

        <View style={styles.cardsRow}>
          {dashboardCards.map((card) => (
            <View key={card.id} style={styles.dashboardCard}>
              <View style={styles.cardIconCircle}>
                <Ionicons name={card.icon} size={23} color="#0A760A" />
              </View>

              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardCount}>{card.count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.complaintsHeader}>
          <Text style={styles.sectionTitle}>My Complaints</Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.complaintList}>
          {complaints.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.complaintCard}
              activeOpacity={0.8}
            >
              <View style={styles.complaintIconBox}>
                <Ionicons name={item.icon} size={20} color="#0A760A" />
              </View>

              <View style={styles.complaintInfo}>
                <Text style={styles.complaintTitle}>{item.title}</Text>

                <View style={styles.complaintMetaRow}>
                  <Ionicons name="location" size={11} color="#717A6D" />
                  <Text style={styles.complaintMeta}>{item.location}</Text>
                </View>

                <View style={styles.complaintMetaRow}>
                  <Ionicons name="calendar" size={11} color="#717A6D" />
                  <Text style={styles.complaintMeta}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={22} color="#0A760A" />
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={23} color="#41493E" />
          <Text style={styles.navText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={22} color="#41493E" />
          <Text style={styles.navText}>My Complaints</Text>
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

  scrollView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 105,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 155,
    height: 58,
  },

  profileButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  greetingSection: {
    marginTop: 16,
  },

  greetingSmall: {
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
    color: "#0A760A",
  },

  greetingName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 25,
    color: "#0A760A",
    marginTop: -2,
  },

  dateText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: "#717A6D",
    marginTop: 2,
  },

  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#0A760A",
    marginTop: 18,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 10,
  },

  dashboardCard: {
    flex: 1,
    minHeight: 104,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  cardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E7F5DB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  cardLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
    color: "#0A760A",
    textAlign: "center",
  },

  cardCount: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#0A760A",
    marginTop: 2,
  },

  complaintsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  viewAllText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#0A760A",
    marginTop: 18,
  },

  complaintList: {
    marginTop: 10,
    gap: 10,
  },

  complaintCard: {
    minHeight: 78,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  complaintIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E7F5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  complaintInfo: {
    flex: 1,
  },

  complaintTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
    color: "#202020",
    marginBottom: 3,
  },

  complaintMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },

  complaintMeta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#717A6D",
    marginLeft: 4,
  },

  statusPill: {
    backgroundColor: "#E7F5DB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
    color: "#0A760A",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E2E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },

  activeNavText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
    color: "#0A760A",
    marginTop: 3,
  },

  navText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
    color: "#41493E",
    marginTop: 3,
  },
});