import React, { ReactElement } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "../../../core/firebaseClient";
import Background from "../../../components/Background";
import Logo from "../../../components/Logo";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import TextInput from "../../../components/TextInput";
import theme from "../../../core/theme";

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
    color: theme.colors.text,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const LoginScreen = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <Background>
      <Logo />

      <Header>Welcome back</Header>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async ({ email, password }, { setErrors }) => {
          try {
            await Auth.signInWithEmailAndPassword(email, password);
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
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.link}>Forgot your password?</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default LoginScreen;
