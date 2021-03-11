import React, { ReactElement, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { compact } from "lodash";
import { useNavigation } from "@react-navigation/native";
import Avatar from "../../components/Avatar";
import Background from "../../components/Background";
import TextInput from "../../components/TextInput";
import { Auth, Storage } from "../../core/firebaseClient";
import Button from "../../components/Button";

const ProfileSchema = Yup.object().shape({
  displayName: Yup.string().required("Required"),
});

const ProfileScreen = (): ReactElement => {
  const navigation = useNavigation();
  const user = Auth.currentUser;
  const [photoURL, setPhotoURL] = useState(user?.photoURL);

  const pickImage = async (mode: "Camera" | "MediaLibrary") => {
    const { status } =
      mode === "Camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      };
      const result =
        mode === "Camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.cancelled) {
        setPhotoURL(result.uri);
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [
          { resize: { width: 512, height: 512 } },
        ]);
        const fileName = manipResult.uri.split("/").slice(-1)[0];
        const response = await fetch(manipResult.uri);
        const blob = await response.blob();
        const storageRef = Storage.ref(
          `${user?.uid}/profilePicture/${fileName}`,
        );
        const newPhotoURL = await (
          await storageRef.put(blob)
        ).ref.getDownloadURL();
        await user?.updateProfile({ photoURL: newPhotoURL });
        setPhotoURL(Auth.currentUser?.photoURL);
      }
    }
  };

  const handleAvatarPressed = () => {
    Alert.alert(
      "Profile picture",
      "Your picture is visible across Voke. For example, people can see your picture when they communicate with you or view content you create.",
      compact([
        {
          text: "Take photo",
          onPress: () => pickImage("Camera"),
        },
        {
          text: "Choose from photos",
          onPress: () => pickImage("MediaLibrary"),
        },
        photoURL && {
          text: "Delete profile picture",
          onPress: async () => {
            await user?.updateProfile({ photoURL: null });
            setPhotoURL(Auth.currentUser?.photoURL);
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]),
    );
  };

  return (
    <Background>
      <Formik
        initialValues={{
          displayName: user?.displayName || "",
        }}
        validationSchema={ProfileSchema}
        onSubmit={async ({ displayName }) => {
          await user?.updateProfile({ displayName });
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "Dashboard" }],
            });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <TouchableOpacity onPress={handleAvatarPressed}>
              <Avatar
                photoURL={photoURL}
                displayName={values.displayName}
                size={100}
              />
            </TouchableOpacity>
            <TextInput
              label="Display Name"
              returnKeyType="next"
              onChangeText={handleChange("displayName")}
              onBlur={handleBlur("displayName")}
              value={values.displayName}
              error={Boolean(errors.displayName && touched.displayName)}
              errorText={errors.displayName}
              autoCompleteType="username"
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              Save Profile
            </Button>
          </>
        )}
      </Formik>
    </Background>
  );
};

export default ProfileScreen;
