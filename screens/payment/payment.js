import { Image } from "react-native"; 
import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { Text, Select } from "native-base";
import { CheckIcon } from "react-native-heroicons/solid";

const Payment = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  totalAmount,
  qrCodeImage, 
  onReferenceNumberChange,
}) => {
  const [cashAmount, setCashAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleCashAmountChange = (value) => {
    const cash = parseFloat(value) || 0;
    setCashAmount(cash);
    const calculatedChange = cash - totalAmount;
    setChange(calculatedChange);

    if (calculatedChange < 0) {
      setErrorMessage("Insufficient cash amount.");
    } else {
      setErrorMessage("");
    }
  };

  const handleConfirm = () => {
    if (selectedPaymentMethod === "GCash" && !referenceNumber.trim()) {
      alert("Please enter the GCash reference number.");
      return;
    }

    onReferenceNumberChange(referenceNumber); 
    onConfirm();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-4/5">
          <Text className="text-lg font-bold mb-4">Checkout Summary</Text>

          {/* Dropdown for Payment Method */}
          <Text className="text-base font-normal mb-2">Payment Method</Text>
          <Select
            selectedValue={selectedPaymentMethod}
            minWidth="200"
            accessibilityLabel="Choose Payment Method"
            placeholder="Choose Payment Method"
            onValueChange={(value) => setSelectedPaymentMethod(value)}
            _selectedItem={{
              bg: "gray.200",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
          >
            <Select.Item label="Cash" value="Cash" />
            <Select.Item label="GCash" value="GCash" />
          </Select>

          {/* Show QR Code for GCash */}
          {selectedPaymentMethod === "GCash" && qrCodeImage && (
            <View className="mt-4 items-center">
              <Text className="text-base font-semibold mb-2">
                Scan QR Code to Pay
              </Text>
              <Image
                source={qrCodeImage}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Reference Number Input for GCash */}
          {selectedPaymentMethod === "GCash" && (
            <>
              <Text className="text-base font-normal mt-4">Reference Number</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mt-2"
                placeholder="Enter GCash reference number"
                value={referenceNumber}
                onChangeText={setReferenceNumber}
              />
            </>
          )}

          {/* Cash Paid (only if cash payment selected) */}
          {selectedPaymentMethod === "Cash" && (
            <>
              <Text className="text-base font-normal mt-4">Cash Paid</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mt-2"
                placeholder="Enter cash amount"
                keyboardType="numeric"
                value={cashAmount.toString()}
                onChangeText={handleCashAmountChange}
              />
              {errorMessage ? (
                <Text className="text-red-500 mt-2">{errorMessage}</Text>
              ) : null}
            </>
          )}

          <Text className="text-base font-semibold mb-2">
            Total Price: ₱{totalAmount.toFixed(2)}
          </Text>

          {selectedPaymentMethod === "Cash" && (
            <Text className="text-base font-normal mt-4">
              Change: ₱{change >= 0 ? change.toFixed(2) : "0.00"}
            </Text>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-6">
            <Pressable
              className="flex-1 bg-[#C92519] p-2 rounded mr-2"
              onPress={onClose}
            >
              <Text className="text-center text-white text-base">Cancel</Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-2 rounded ml-2 ${
                isLoading || (selectedPaymentMethod === "Cash" && change < 0)
                  ? "bg-gray-400"
                  : "bg-[#0080FF]"
              }`}
              onPress={handleConfirm}
              disabled={isLoading || (selectedPaymentMethod === "Cash" && change < 0)}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-white text-base">
                  Confirm
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Payment;