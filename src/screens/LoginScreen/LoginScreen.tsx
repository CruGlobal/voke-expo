import React, { ReactElement, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
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
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});

type Props = {
  navigation: Navigation;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const LoginScreen = ({ navigation }: Props): ReactElement => {
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged((user) => {
      if (user) navigation.navigate("DashboardScreen");
    });
  }, [navigation]);

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />

      <Logo />

      <Header>Welcome back.</Header>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async ({ email, password }, { setErrors }) => {
          try {
            await firebaseClient
              .auth()
              .signInWithEmailAndPassword(email, password);
          } catch (ex) {
            switch (ex.code) {
              case "auth/user-disabled":
                setErrors({
                  email:
                    "This email address account has been disabled. Please try again.",
                });
                break;
              case "auth/user-not-found":
                setErrors({
                  email: "Email address not found. Please try again.",
                });
                break;
              case "auth/wrong-password":
                setErrors({
                  password:
                    "password does not match the given email. Please try again.",
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

            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
              >
                <Text style={styles.label}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              Login
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default LoginScreen;
