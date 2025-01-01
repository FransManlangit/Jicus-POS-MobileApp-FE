import { Image } from "react-native"; 
import React, { useState, useEffect } from "react";
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
  onCashAmountChange,
  cashAmount,
}) => {

  const [change, setChange] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    if (selectedPaymentMethod === "Cash") {
      const cash = parseFloat(cashAmount) || 0;
      setChange(cash - totalAmount);
    }
  }, [cashAmount, totalAmount, selectedPaymentMethod]);

  const handleCashAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    onCashAmountChange(numericValue);
  };

  const handleReferenceNumberChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 13) {
      setReferenceNumber(numericValue);
      onReferenceNumberChange(numericValue);
    }
  };

  const handleConfirm = () => {
    if (selectedPaymentMethod === "GCash" && referenceNumber.length !== 13) {
      setErrorMessage("Reference number must be exactly 13 digits.");
      return;
    }

    const parsedCashAmount = parseFloat(cashAmount);
    if (selectedPaymentMethod === "Cash" && (isNaN(parsedCashAmount) || parsedCashAmount <= 0)) {
      setErrorMessage("Please enter a valid cash amount.");
      return;
    }

    if (selectedPaymentMethod === "Cash" && parsedCashAmount < totalAmount) {
      setErrorMessage("Insufficient cash. Please enter a valid amount.");
      return;
    }

    setErrorMessage("");
    onConfirm();
  };



  return (
    <Modal transparent animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-4/5">
          <Text className="text-lg font-bold mb-4">Checkout Summary</Text>

          <Text className="text-base font-normal mb-2">Payment Method</Text>
          <Select
            className="h-10"
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
                onChangeText={handleReferenceNumberChange}
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
            <Pressable className="flex-1 bg-[#C92519] p-2 rounded mr-2" onPress={onClose}>
              <Text className="text-center text-white text-base">Cancel</Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-2 rounded ml-2 ${isLoading || (selectedPaymentMethod === "Cash" && change < 0) ? "bg-gray-400" : "bg-[#0080FF]"}`}
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
