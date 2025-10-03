import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  containerStyles = '',
  textStyles = '',
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`custom-btn ${containerStyles} ${disabled || isLoading ? 'opacity-50' : ''}`}
      activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text
          className={`text-white font-quicksand-semibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
