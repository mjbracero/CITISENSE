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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const logo = require("../../assets/images/logowname.png");
const people = require("../../assets/images/people.png");
const person = require("../../assets/images/person.png");
const userShield = require("../../assets/images/user-shield.png");

const roles = [
  { id: "citizen", label: "Citizen", icon: people },
  { id: "moderator", label: "Moderator", icon: person },
  { id: "admin", label: "Admin", icon: userShield },
];

export default function LoginScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
      if (authError || !authData?.user) {
        Alert.alert("Login failed", authError?.message || "Invalid credentials");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, email")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (profileError || !profile) {
        Alert.alert("Login failed", "User profile not found");
        return;
      }

      if (profile.role !== selectedRole) {
        Alert.alert(
          "Role mismatch",
          `This account is registered as ${profile.role}. Cannot login as ${selectedRole}`
        );
        return;
      }

      await AsyncStorage.setItem("user_role", profile.role);
      await AsyncStorage.setItem("user_email", profile.email);
      router.replace(selectedRole === "citizen" ? "/home" : `/${selectedRole}`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Welcome back!</Text>
          <Text style={[styles.subtitle, { fontFamily: "Poppins_400Regular" }]}>
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
                >
                  <Image source={role.icon} style={styles.roleIcon} />
                  <Text
                    style={{
                      fontFamily: isSelected ? "Poppins_700Bold" : "Poppins_600SemiBold",
                      color: isSelected ? "#0A760A" : "#000000",
                      fontSize: 12,
                    }}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={18} color="#0A760A" />
              <TextInput
                style={[styles.input, { fontFamily: "Poppins_400Regular" }]}
                placeholder="Enter your email"
                placeholderTextColor="#717A6D"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={18} color="#0A760A" />
              <TextInput
                style={[styles.input, { fontFamily: "Poppins_400Regular", paddingRight: 38 }]}
                placeholder="Enter your password"
                placeholderTextColor="#717A6D"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 10 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="#717A6D" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.loginButtonText, { fontFamily: "Poppins_600SemiBold" }]}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={{ fontFamily: "Poppins_400Regular" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={{ fontFamily: "Poppins_700Bold", color: "#0A760A" }}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flexGrow: 1, alignItems: "center", paddingHorizontal: 31, paddingTop: 28 },
  logo: { width: 180, height: 180, marginTop: 4 },
  title: { fontSize: 31, color: "#0A760A", marginTop: 10 },
  subtitle: { width: 270, textAlign: "center", fontSize: 12, color: "#41493E", lineHeight: 17, marginTop: 5 },
  roleContainer: { width: "100%", height: 79, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, flexDirection: "row", marginTop: 24, overflow: "hidden", backgroundColor: "#FFFFFF" },
  roleCard: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  activeRoleCard: { backgroundColor: "#E7F5DB", borderWidth: 1, borderColor: "#0A760A", borderRadius: 8 },
  roleIcon: { width: 30, height: 30, marginBottom: 5 },
  form: { width: "100%", marginTop: 16 },
  label: { fontSize: 13, color: "#41493E", marginBottom: 6, marginTop: 8 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#B4B4B4", borderRadius: 7, paddingHorizontal: 12, height: 48, marginBottom: 12 },
  input: { flex: 1, height: "100%", fontSize: 13, color: "#41493E", marginLeft: 8 },
  loginButton: { backgroundColor: "#0A760A", borderRadius: 50, height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "#fff", fontSize: 16 },
  registerContainer: { flexDirection: "row", marginTop: 16, alignItems: "center" },
});