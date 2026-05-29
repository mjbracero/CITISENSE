import { View, Image, StyleSheet } from "react-native";

const logo = require("../../assets/images/logowname.png");

export default function LogoScreen() {
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