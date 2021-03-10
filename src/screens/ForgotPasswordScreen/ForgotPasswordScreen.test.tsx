import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ForgotPasswordScreen from ".";

const navigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const reactNavigationNative = jest.requireActual("@react-navigation/native");
  return {
    ...reactNavigationNative,
    useNavigation: () => ({
      navigate,
    }),
  };
});

let promise = Promise.resolve();
const sendPasswordResetEmail = jest.fn(() => promise);
jest.mock("../../core/firebaseClient", () => ({
  auth: () => ({
    sendPasswordResetEmail,
  }),
}));

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    promise = Promise.resolve();
  });

  describe("when valid email", () => {
    it("submits email", async () => {
      const { getByTestId, getByText } = render(<ForgotPasswordScreen />);
      fireEvent.changeText(getByTestId("email"), "test@example.com");
      fireEvent.press(getByText("Send Reset Instructions"));
      await waitFor(() =>
        expect(sendPasswordResetEmail).toHaveBeenCalledWith("test@example.com"),
      );
      expect(navigate).toHaveBeenCalledWith("Login");
    });
  });

  describe("when email not found", () => {
    beforeEach(() => {
      promise = Promise.reject({ code: "auth/user-not-found" });
    });
    it("submits email and shows error message", async () => {
      const { getByTestId, getByText } = render(<ForgotPasswordScreen />);
      fireEvent.changeText(getByTestId("email"), "test@example.com");
      fireEvent.press(getByText("Send Reset Instructions"));
      await waitFor(() =>
        expect(sendPasswordResetEmail).toHaveBeenCalledWith("test@example.com"),
      );
      expect(
        getByText("Email address not found. Please try again."),
      ).toBeTruthy();
    });
  });

  describe("when unknown error", () => {
    beforeEach(() => {
      promise = Promise.reject({ code: "auth/unknown" });
    });
    it("submits email and shows error message", async () => {
      const { getByTestId, getByText } = render(<ForgotPasswordScreen />);
      fireEvent.changeText(getByTestId("email"), "test@example.com");
      fireEvent.press(getByText("Send Reset Instructions"));
      await waitFor(() =>
        expect(sendPasswordResetEmail).toHaveBeenCalledWith("test@example.com"),
      );
      expect(
        getByText("An unexpected error occurred. Please try again."),
      ).toBeTruthy();
    });
  });
});
