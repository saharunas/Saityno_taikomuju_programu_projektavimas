import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  overlay: {
    position: "relative",
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    width: "80%",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "black",
    padding: 20,
    borderRadius: 12,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  title: { fontSize: 22, marginBottom: 16, textAlign: "center" },
  text: { fontSize: 14, marginBottom: 16 },
});
