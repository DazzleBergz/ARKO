import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import SelectInput from "./selectInput";
import { danger } from "@/constants/Colors";
import { ThemedText } from "../themeUI/ThemedText";

interface InputProps {
    label?: string;
    iconName?: any;
    error?: string;
    password?: boolean;
    items?: { label: string; value: any }[];
    isEditable?: boolean;
    value?: string;
    setValue?: (value: any) => void;
    onFocus?: () => void;
}

const Select: React.FC<InputProps> = ({
    label,
    iconName,
    error,
    password,
    items,
    isEditable = true,
    value,
    setValue,
    onFocus = () => {},
}) => {
    const colorScheme = useColorScheme();
    const [hidePassword, setHidePassword] = useState(password);
    const [isFocused, setFocused] = useState(false);
    return (
        <View style={styles.container}>
            <View style={[styles.formcontainer, isFocused && styles.focus, error && styles.error]}>
                {(isFocused || value) && (
                    <Text
                        style={[
                            styles.label,
                            {
                                color: error ? "red" : isFocused ? "#537FE7" : (colorScheme === "dark" ? "#D3D3D3" : "#545454"),
                                backgroundColor: colorScheme === "dark" ? "#151718" : "#F6F6F6",
                            }
                        ]}
                    >
                        {label}
                    </Text>
                )}
                <Ionicons
                    name={iconName}
                    style={[styles.iconHead, error && styles.error, { color: colorScheme === "dark" ? "#D3D3D3" : "#545454" }]}
                />

                {items ? (
                <Dropdown
                    data={items}
                    value={value}
                    onChange={(item) => setValue && setValue(item.value)}
                    style={styles.dropdown}
                    placeholder={label}
                    placeholderStyle={{ color: colorScheme === "dark" ? "#D3D3D3" : "#545454" }}
                    labelField="label"
                    valueField="value"
                    activeColor={colorScheme === "dark" ? "#545454" : "#D3D3D3"}
                    onFocus={() => {
                        onFocus();
                        setFocused(true);
                    }}
                    onBlur={() => {
                        if (!value) { 
                            setFocused(false);
                        } else {
                            setTimeout(() => setFocused(false), 100); // Ensure smooth transition
                        }
                    }}
                    renderItem={(item) => (
                        <View style={{ padding: 15 }}>
                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    color: item.value === "SOS" ? "red" : colorScheme === "dark" ? "#D3D3D3" : "#545454",
                                    fontFamily: item.value === "SOS" ? "CeraPro_Medium" : "CeraPro",
                                }}
                            >
                                {item.label}
                            </ThemedText>
                        </View>
                    )}
                    containerStyle={{
                        backgroundColor: colorScheme === "dark" ? "#151718" : "#F6F6F6",
                    }}
                    fontFamily="CeraPro"
                    selectedTextStyle={{
                        fontFamily: "CeraPro",
                        fontSize: 16,
                        color: colorScheme === "dark" ? "#D3D3D3" : "#545454"
                    }}
                />
                ) : (
                    <SelectInput value={value}  />
                    )}
            </View>

        {error && <Text style={styles.errmsg}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "95%",
        marginBottom: 5,
    },
    back:{
        marginVertical: 20,
    },
    backBtn:{
        justifyContent: "center",
        alignContent: "center"
    },
    formcontainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#717171",
        borderRadius: 5,
        height: 47,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "CeraPro",
    },
    iconHead: {
        fontSize: 24,
        padding: 10,
    },
    icon: {
        fontSize: 24,
        position: "absolute",
        top: 0,
        right: 0,
        marginTop: 10,
        marginRight: 10,
    },
    dropdown: {
        flex: 1,
        borderColor: "transparent",
    },
    focus: {
        borderColor: "#0B60B0",
        borderWidth: 2,
    },
    error: {
        borderColor: "red",
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
});

export default Select;
