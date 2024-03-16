import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// import { lineSpinner } from "ldrs";
// lineSpinner.register();

export default function Cam(props) {
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraPermission, requestCameraPermission] =
        Camera.useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef();

    // CAMERA PERMISSIONS -----------------------------------------------------------------------------------------------------
    if (!cameraPermission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!cameraPermission.granted) {
        // Camera permissions are not granted yet
        return (
            // PERMISSIONS SCREEN --------------------------------------------------------------------------------------
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button
                    onPress={requestCameraPermission}
                    title="Grant camera permission"
                />
            </View>
        );
    }

    // TAKE PICTURE -----------------------------------------------------------------------------------------------------
    let takePic = async () => {
        if (cameraRef.current) {
            let options = {
                quality: 1, // for the best quality of photos
                base64: true,
                exif: false, // extra info about the photo
            };
            let newPhoto = await cameraRef.current.takePictureAsync(options);
            setPhoto(newPhoto); // triggers a rerender
        }
    };

    // SEND TO BACKEND -----------------------------------------------------------------------------------------------------
    let sendToAnalyzer = async () => {
        try {
            // Read the image as base64
            const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // console.log("Base64 Image:", base64Image);

            // Now you can send the base64Image string to your server using fetch or another HTTP library
            // For example:
            fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: base64Image }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            console.log("Response: " + response.json());
        } catch (error) {
            console.error("Error uploading image:", error);
        }

        setPhoto(null); // deletes photo from memory
    };

    let retake = () => {
        setPhoto(null);
    };

    // PHOTO CAPTURED SCREEN -----------------------------------------------------------------------------------------------------
    if (photo) {
        return (
            <SafeAreaView>
                <Image style={styles.preview} source={{ uri: photo.uri }} />

                <View style={styles.labelContainer}>
                    <TouchableOpacity
                        style={styles.labelButton}
                        onPress={sendToAnalyzer}
                    >
                        <MaterialCommunityIcons
                            name={"check"}
                            size={40}
                            color={"#a5d4a9"}
                        />
                        <Text style={styles.iconLabel}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.labelButton}
                        onPress={retake}
                    >
                        <MaterialCommunityIcons
                            name={"close"}
                            size={40}
                            color={"#a5d4a9"}
                        />
                        <Text style={styles.iconLabel}>Discard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // FLIP CAMERA --------------------------------------------------------------------------------------
    function toggleCameraType() {
        setType((current) =>
            current === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }

    // CAMERA SCREEN --------------------------------------------------------------------------------------
    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    {/* create an empty view tag for justifyContent: evenly-spaced. GENIUS SOLUTION */}
                    <View style={styles.button}></View>
                    <View style={styles.buttonOutline}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePic}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraType}
                    >
                        <MaterialCommunityIcons
                            name={"camera-flip"}
                            size={40}
                            color={"#a5d4a9"}
                        />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        width: width,
    },
    buttonContainer: {
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: height - height * 0.3,
    },
    captureButton: {
        borderWidth: 4,
        borderColor: "#43a156",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        backgroundColor: "#a5d4a9",
        borderRadius: 50,
    },
    buttonOutline: {
        alignItems: "center",
        justifyContent: "center",
        width: 64,
        height: 64,
        backgroundColor: "#a5d4a9",
        borderRadius: 50,
    },
    labelContainer: {
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    labelButton: {
        alignSelf: "flex-end",
        alignItems: "center",
    },
    iconLabel: {
        fontSize: 20,
        color: "#a5d4a9",
    },
    button: {
        alignSelf: "flex-end",
        alignItems: "center",
        width: 60,
    },
    text: {
        fontSize: 20,
        color: "#F5F5F5",
    },
    preview: {
        width: width / 2,
        height: height / 2,
    },
});
