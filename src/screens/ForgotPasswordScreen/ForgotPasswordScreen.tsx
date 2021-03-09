import React, { ReactElement } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import theme from "../../core/theme";
import Button from "../../components/Button";
import firebaseClient from "../../core/firebaseClient";

const styles = StyleSheet.create({
  back: {
    width: "100%",
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: "100%",
  },
});

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPasswordScreen = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <Background>
      <Logo />

      <Header>Restore Password</Header>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async ({ email }, { setErrors }) => {
          try {
            await firebaseClient.auth().sendPasswordResetEmail(email);
            navigation.navigate("Login");
          } catch (ex) {
            switch (ex.code) {
              case "auth/user-not-found":
                setErrors({
                  email: "Email address not found. Please try again.",
                });
                break;
              default:
                setErrors({
                  email: "An unexpected error occurred. Please try again.",
                });
            }
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
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={Boolean(errors.email && touched.email)}
              errorText={errors.email}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={styles.button}
            >
              Send Reset Instructions
            </Button>
          </>
        )}
      </Formik>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.label}>← Back to login</Text>
      </TouchableOpacity>
    </Background>
  );
};

export default ForgotPasswordScreen;
