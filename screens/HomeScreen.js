import { StyleSheet, Text, View, Button } from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View>
            <Text>Welcome To Barter</Text>

            <Button
                title="Scan Food"
                onPress={() => navigation.navigate("Camera")}
            />

            <Button
                title="Trade Food"
                onPress={() => navigation.navigate("Maps")}
            />
        </View>
    );
}
