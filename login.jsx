import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const logo = require("../../assets/images/logowname.png");
const emailIcon = require("../../assets/images/icon-2.png");
const lockIcon = require("../../assets/images/lock.png");
const people = require("../../assets/images/people.png");
const person = require("../../assets/images/person.png");
const userShield = require("../../assets/images/user-shield.png");

const HOME_ROUTE = "/home";

const roles = [
  { id: "citizen", label: "Citizen", icon: people },
  { id: "moderator", label: "Moderator", icon: person },
  { id: "admin", label: "Admin", icon: userShield },
];

export default function LoginScreen() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("citizen");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const validateLogin = () => {
    const email = emailOrPhone.trim();
    const pass = password.trim();

    if (!email || !pass) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      setIsLoading(true);

      const email = emailOrPhone.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });

      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }

      if (!data?.session) {
        Alert.alert(
          "Login failed",
          "No active session was created. Please verify your email first."
        );
        return;
      }

      router.replace(HOME_ROUTE);
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Welcome back!</Text>

          <Text style={styles.subtitle}>
            Sign in to continue improving our community together.
          </Text>

          <View style={styles.roleContainer}>
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;

              return (
                <TouchableOpacity
                  key={role.id}
                  style={[styles.roleCard, isSelected && styles.activeRoleCard]}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={role.icon}
                    style={styles.roleIcon}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.roleText,
                      isSelected && styles.activeRoleText,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>

            <View style={styles.inputWrapper}>
              <Image
                source={emailIcon}
                style={styles.inputIcon}
                resizeMode="contain"
              />

              <TextInput
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                placeholder="Enter your email address"
                placeholderTextColor="#717A6D"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Password</Text>

            <View style={styles.inputWrapper}>
              <Image
                source={lockIcon}
                style={styles.inputIcon}
                resizeMode="contain"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#717A6D"
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={18}
                  color="#717A6D"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginText}>Log in</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 31,
    paddingTop: 28,
    paddingBottom: 18,
  },

  logo: {
    width: 180,
    height: 180,
    marginTop: 4,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 31,
    color: "#0A760A",
    marginTop: 10,
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    width: 270,
    textAlign: "center",
    fontSize: 12,
    color: "#41493E",
    lineHeight: 17,
    marginTop: 5,
  },

  roleContainer: {
    width: "100%",
    height: 79,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  roleCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  activeRoleCard: {
    backgroundColor: "#E7F5DB",
    borderWidth: 1,
    borderColor: "#0A760A",
    borderRadius: 8,
  },

  roleIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },

  roleText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#000000",
  },

  activeRoleText: {
    fontFamily: "Poppins_700Bold",
    color: "#0A760A",
  },

  form: {
    width: "100%",
    marginTop: 16,
  },

  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#41493E",
    marginBottom: 6,
    marginTop: 8,
  },

  inputWrapper: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#B4B4B4",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },

  input: {
    fontFamily: "Poppins_400Regular",
    flex: 1,
    height: "100%",
    fontSize: 13,
    color: "#41493E",
  },

  passwordInput: {
    paddingRight: 38,
  },

  eyeButton: {
    position: "absolute",
    right: 16,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 9,
  },

  forgotText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#0A760A",
  },

  loginButton: {
    width: "100%",
    height: 49,
    backgroundColor: "#0A760A",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 23,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
  },

  registerContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },

  registerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#41493E",
  },

  registerLink: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#0A760A",
  },
});