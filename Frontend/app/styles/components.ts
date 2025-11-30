import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const toolbarStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  inner: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  side: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 8,
  },
  rightSide: {
    justifyContent: "flex-end",
  },
  leftSide: {
    justifyContent: "flex-start",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#000000",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
});

export const cards = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,

    // make edit button align right
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardContent: {
    flex: 1, // take up all available space
    paddingRight: 10,
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 8,
    height: "90%",
    justifyContent: "center",
  },

  editButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: "center",
  },

  cardLeftArea: {
    flex: 1, // take up available width
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cardModal: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  areYouSure: {
    width: "50%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  bold: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#4b5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 90,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ff0000ff",
    marginRight: 8,
  },
  createButton: {
    backgroundColor: "#2563eb",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "500",
  },
  createText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
