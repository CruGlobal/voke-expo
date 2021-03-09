import React, { ReactElement } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import firebaseClient from "../../core/firebaseClient";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const RegisterScreen = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <Background>
      <Logo />

      <Header>Create Account</Header>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={async ({ email, password }, { setErrors }) => {
          try {
            await firebaseClient
              .auth()
              .createUserWithEmailAndPassword(email, password);
          } catch (ex) {
            switch (ex.code) {
              case "auth/email-already-in-use":
                setErrors({
                  email: "Email address already in use. Please try again.",
                });
                break;
              case "auth/invalid-email":
                setErrors({
                  email: "Email address invalid. Please try again.",
                });
                break;
              case "auth/weak-password":
                setErrors({
                  password: "password is not strong enough. Please try again.",
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
              label="Email"
              returnKeyType="next"
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

            <TextInput
              label="Password"
              returnKeyType="done"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={Boolean(errors.password && touched.password)}
              errorText={errors.password}
              secureTextEntry
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={styles.button}
            >
              Sign Up
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default RegisterScreen;
