import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; 
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation(); // React Native Navigation
    const resStatus = null;
    const handleSubmit = async () => {
        try {
            const res = await api.post(`/api/token/`, {
                username: userName,
                password: password,
            });
            if (res.status === 200) {
                await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
                await AsyncStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigation.navigate("Home");
            }
        } catch (error) {
            alert("Invalid credentials. Please try again."+ resStatus);
        }
    };

    return (
        <View>
            <View >
                <Text>Welcome to What The Truck!</Text>
                <Text>Sign in to access your supervisor dashboard.</Text>
            </View>
            <View >
                <Text >Login</Text>

                <Text >Username</Text>
                <TextInput
                    placeholder="Enter your username"
                    value={userName}
                    onChangeText={setUserName}
                />

                <Text>Password</Text>
                <View>
                    <TextInput
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />

                </View>

                <TouchableOpacity onPress={handleSubmit}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;