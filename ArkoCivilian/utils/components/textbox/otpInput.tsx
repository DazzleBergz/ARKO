import { Ionicons } from "@expo/vector-icons";

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { useColorScheme } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  iconName?: any;
  error?: string;
  password?: boolean;
  item?: any; 
  isEditable?: boolean;
  value?: string;
  changeAccount?: (value: string) => void;
  onFocus?: () => void;
}

const OTPInput: React.FC<InputProps> = ({
    label,
    iconName,
    error,
    item,
    isEditable,
    value,
    changeAccount,
    onFocus = () => {},
    ...props
}) => {

    const colorScheme = useColorScheme();
    const [isFocused, setFocused] = React.useState(false);

    return (
    <View style={style.container}>
        <View style={[style.formcontainer, isFocused && style.focus, error && style.error,]}>
            {label && (isFocused || item) && (
                <Text
                    style={[
                    style.label,
                    { color: error ? 'red' : isFocused ? '#537FE7': colorScheme === 'dark' ? '#D3D3D3' : '#545454',
                        backgroundColor: colorScheme === "dark" ? "#151718" : "#F6F6F6",
                    }
                    ]}
                >
                    {label}
                </Text>
            )}
            <Ionicons name={iconName} style={[style.iconHead, error && style.error, {color: colorScheme === 'dark' ? '#D3D3D3' : '#545454'}]} />
            <TextInput
                style={[style.textInput, {color: colorScheme === 'dark' ? '#D3D3D3' : '#545454'}]}
                placeholder={label}
                placeholderTextColor={colorScheme === 'dark' ? '#D3D3D3' : '#545454'}
                {...props}
                onFocus={() => {
                    onFocus();
                    setFocused(true);
                }}
                onBlur={() => setFocused(false)}
                keyboardType="numeric"
                maxLength={6}
                value={value}
                editable={isEditable}
            >
                {item}
            </TextInput>
        </View>

      {error && <Text style={style.errmsg}>{error}</Text>}
    </View>
  );
};


const style = StyleSheet.create({
    container: {
        width: '50%',
        marginBottom: 5,
        marginRight: 10,
    },

    formcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#717171',
        borderRadius: 5,
        height: 47
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "CeraPro"
    },
    iconHead:{
        fontSize: 24,
        padding: 10,
    },
    icon: {
        fontSize: 24,
        position: "absolute",
        top: 0,
        right: 0,
        color: "#8B8D8F",
        marginTop: 10,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    focus: {
        borderColor: "#0B60B0",
        borderWidth: 2,
    },
    errorBG: {
        borderColor: "red",
    },
    errlabel: {
        color: "red",
    },
    errmsg: {
        position: "absolute",
        marginVertical: 50,
        marginLeft: 5,
        color: "red",
        fontSize: 12,
        fontFamily: "CeraPro",
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 12,
        top: -10,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        fontFamily: "CeraPro",
        color: "#537FE7",
    },
    error: {
        borderColor: "red",
        color: "red",
    },
});

export default OTPInput;
