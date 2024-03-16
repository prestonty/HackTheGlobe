import React from "react";
import { View, Text } from "react-native";
import PhotoTaker from "../components/PhotoTaker";

export default function CameraScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Text>Welcome To Camera Screen</Text>
            <PhotoTaker />
        </View>
    );
}
