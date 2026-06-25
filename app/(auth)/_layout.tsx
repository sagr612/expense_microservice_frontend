import React from 'react';
import {Redirect, Stack} from "expo-router";
import {useAuth} from "@/context/AuthContext";

const AuthLayout = () => {
    const { login, isLoading, user } = useAuth();
    if (user) {

        return <Redirect href="/(root)"/>;
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{headerShown: false}}  />
            <Stack.Screen name="SignUp" options={{headerShown: false}}  />
        </Stack>
    );
};

export default AuthLayout;