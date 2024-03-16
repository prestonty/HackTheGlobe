import { StyleSheet, Text, View } from "react-native";
import PhotoTaker from "../components/PhotoTaker";

export default function CameraScreen() {
    return (
        <View>
            <Text>Welcome To Camera Screen</Text>
            <PhotoTaker />
        </View>
    );
}
