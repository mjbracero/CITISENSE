import { View, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const logo = require("../../assets/images/logowname.png");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 244,
    height: 244,
  },
});