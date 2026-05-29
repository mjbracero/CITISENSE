import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SubmitComplaint() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Submit Complaint</Text>
        <Text style={styles.subtitle}>
          Choose the type of report you want to submit
        </Text>

        <View style={styles.assistantHeader}>
          <View style={styles.avatarCircle}>
            <Image
              source={{ uri: "https://placehold.co/64x64" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.assistantName}>CitiSense Assistant</Text>
        </View>
      </View>

      {/* Chat Area */}
      <View style={styles.content}>
        <View style={styles.chatRow}>
          <Image
            source={{ uri: "https://placehold.co/48x48" }}
            style={styles.chatAvatar}
          />

          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Hello! I’m CitiSense Assistant. I’m here to help you submit your
              complaint.
            </Text>
            <Text style={styles.timeText}>9:41 AM</Text>
          </View>
        </View>

        {/* Emergency Option */}
        <TouchableOpacity style={[styles.optionCard, styles.emergencyCard]}>
          <View style={styles.iconCircleRed}>
            <Image
              source={{ uri: "https://placehold.co/43x39" }}
              style={styles.optionIcon}
            />
          </View>

          <View style={styles.optionTextBox}>
            <Text style={styles.emergencyTitle}>REPORT EMERGENCY</Text>
            <Text style={styles.optionSubtitle}>Needs immediate action</Text>
          </View>
        </TouchableOpacity>

        {/* Regular Complaint Option */}
        <TouchableOpacity style={[styles.optionCard, styles.regularCard]}>
          <View style={styles.iconCircleGreen}>
            <Image
              source={{ uri: "https://placehold.co/42x42" }}
              style={styles.optionIcon}
            />
          </View>

          <View style={styles.optionTextBox}>
            <Text style={styles.regularTitle}>REGULAR COMPLAINT</Text>
            <Text style={styles.optionSubtitle}>Non-emergency concern</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.chatRow}>
          <Image
            source={{ uri: "https://placehold.co/48x48" }}
            style={styles.chatAvatar}
          />

          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Please choose an option above to continue.
            </Text>
            <Text style={styles.timeText}>9:41 AM</Text>
          </View>
        </View>
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={26} color="#404040" />
        </TouchableOpacity>

        <View style={styles.inputBox}>
          <TextInput
            placeholder=""
            style={styles.input}
            placeholderTextColor="#777"
          />
          <Ionicons name="mic-outline" size={20} color="#404040" />
        </View>

        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="add-circle" size={26} color="#166534" />
          <Text style={styles.navText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text-outline" size={24} color="#000" />
          <Text style={styles.navText}>My Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
  },

  header: {
    height: 175,
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  backButton: {
    position: "absolute",
    left: 15,
    top: 47,
    zIndex: 2,
  },

  title: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#14532D",
    fontFamily: "Poppins",
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#404040",
    fontFamily: "Poppins",
  },

  assistantHeader: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  assistantName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Poppins",
  },

  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 18,
  },

  chatRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },

  messageBubble: {
    width: 245,
    minHeight: 80,
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    padding: 14,
  },

  messageText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#404040",
    lineHeight: 17,
    fontFamily: "Poppins",
  },

  timeText: {
    marginTop: 8,
    alignSelf: "flex-end",
    fontSize: 9,
    fontWeight: "500",
    color: "#404040",
    fontFamily: "Poppins",
  },

  optionCard: {
    height: 82,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  emergencyCard: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECACA",
  },

  regularCard: {
    backgroundColor: "#FAFAF9",
    borderColor: "#BBF7D0",
  },

  iconCircleRed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#B91C1C",
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircleGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#166534",
    alignItems: "center",
    justifyContent: "center",
  },

  optionIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },

  optionTextBox: {
    flex: 1,
    alignItems: "center",
  },

  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B91C1C",
    fontFamily: "Poppins",
  },

  regularTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    fontFamily: "Poppins",
  },

  optionSubtitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
    color: "#404040",
    fontFamily: "Poppins",
  },

  inputContainer: {
    position: "absolute",
    bottom: 100,
    left: 18,
    right: 18,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#D4D4D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  inputBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D4D4D8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins",
  },

  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#166534",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  bottomNav: {
    height: 86,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
  },

  navText: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Poppins",
  },
});