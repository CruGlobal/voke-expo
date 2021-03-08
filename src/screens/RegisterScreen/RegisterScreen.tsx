import React, { ReactElement, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import firebaseClient from "../../core/firebaseClient";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import theme from "../../core/theme";
import { Navigation } from "../../types";

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

type Props = {
  navigation: Navigation;
};

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const RegisterScreen = ({ navigation }: Props): ReactElement => {
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged((user) => {
      if (user) navigation.navigate("DashboardScreen");
    });
  }, [navigation]);

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />

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
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default RegisterScreen;
