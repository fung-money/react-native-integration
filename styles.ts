import { StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginRight: 15,
    marginTop: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  stationId: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  powerBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  powerText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  headerIcon: {
    marginTop: 5,
  },
  headerIconText: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  vehicleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  carIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  carIconText: {
    fontSize: 48,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addVehicleText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  costCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  costAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  costDescription: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsIcon: {
    color: '#2196F3',
    fontSize: 12,
    marginRight: 4,
  },
  detailsText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  rfidCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  rfidLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  rfidContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rfidIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  rfidId: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'monospace',
  },
  paymentMethodCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  paymentMethodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dropdownArrow: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#E0E0E0',
  },
  dropdownOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  paymentButtonSection: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
  },
  reservationText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chargingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  chargingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  chargingIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  chargingIconText: {
    fontSize: 40,
  },
  chargingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  chargingSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});