import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";
import { Login } from "../login";
import { AuthLayout } from "../auth-layout";
import { LoginForm } from "../login-form";
import { ForgotPasswordForm } from "../forgot-password-form";
import { OtpVerificationForm } from "../otp-verification-form";
import { ResetPasswordForm } from "../reset-password-form";
import { OtpInput } from "../otp-input";

describe("AuthLayout", () => {
  it("renders the logo, marketing copy, and children", () => {
    render(
      <AuthLayout logoSrc="/logo.svg" logoAlt="MyOperator">
        <p className="m-0">card content</p>
      </AuthLayout>
    );

    expect(screen.getByAltText("MyOperator")).toBeInTheDocument();
    expect(screen.getByText("card content")).toBeInTheDocument();
    expect(
      screen.getByText("Continue managing conversations efficiently")
    ).toBeInTheDocument();
  });

  it("renders a custom logo node instead of the image", () => {
    render(
      <AuthLayout logo={<span>custom logo</span>} logoSrc="/logo.svg">
        <span />
      </AuthLayout>
    );

    expect(screen.getByText("custom logo")).toBeInTheDocument();
    expect(screen.queryByAltText("MyOperator")).not.toBeInTheDocument();
  });

  it("hides the marketing panel when hideMarketingPanel is set", () => {
    render(
      <AuthLayout hideMarketingPanel>
        <span />
      </AuthLayout>
    );

    expect(
      screen.queryByText("Continue managing conversations efficiently")
    ).not.toBeInTheDocument();
  });

  it("applies custom className and forwards the ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <AuthLayout ref={ref} className="custom-layout" data-testid="layout">
        <span />
      </AuthLayout>
    );

    expect(screen.getByTestId("layout")).toHaveClass("custom-layout");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    assertNoBootstrapMarginBleed(container);
  });
});

describe("LoginForm", () => {
  it("renders the default heading, fields, and actions", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter the details below to continue")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter mobile number")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create an Account" })
    ).toBeInTheDocument();
  });

  it("fires change handlers for both fields", () => {
    const onMobileNumberChange = vi.fn();
    const onPasswordChange = vi.fn();
    render(
      <LoginForm
        onMobileNumberChange={onMobileNumberChange}
        onPasswordChange={onPasswordChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter mobile number"), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "secret123" },
    });

    expect(onMobileNumberChange).toHaveBeenCalledWith("9876543210");
    expect(onPasswordChange).toHaveBeenCalledWith("secret123");
  });

  it("disables the submit button until both fields have a value", () => {
    const { rerender } = render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

    rerender(<LoginForm mobileNumber="9876543210" password="secret123" />);
    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("submits the form when the submit button is pressed", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <LoginForm
        mobileNumber="9876543210"
        password="secret123"
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders the mobile validation message", () => {
    render(<LoginForm mobileError="Please enter a valid mobile number." />);
    expect(
      screen.getByText("Please enter a valid mobile number.")
    ).toBeInTheDocument();
  });

  it("renders the password error", () => {
    render(<LoginForm passwordError="Incorrect password. Please try again." />);
    expect(
      screen.getByText("Incorrect password. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders a form-level error with the remaining attempt count", () => {
    render(
      <LoginForm
        formError="Login attempt failed. Kindly re-check the details you have entered."
        attemptsLeft={4}
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("4 more attempts left.")).toBeInTheDocument();
  });

  it("toggles password visibility through onTogglePassword", () => {
    const onTogglePassword = vi.fn();
    const { rerender } = render(
      <LoginForm password="secret" onTogglePassword={onTogglePassword} />
    );

    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onTogglePassword).toHaveBeenCalledTimes(1);

    rerender(
      <LoginForm
        password="secret"
        showPassword
        onTogglePassword={onTogglePassword}
      />
    );
    expect(screen.getByPlaceholderText("Enter password")).toHaveAttribute(
      "type",
      "text"
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();
  });

  it("fires onForgotPassword and onCreateAccount", () => {
    const onForgotPassword = vi.fn();
    const onCreateAccount = vi.fn();
    render(
      <LoginForm
        onForgotPassword={onForgotPassword}
        onCreateAccount={onCreateAccount}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Forgot Password?" }));
    fireEvent.click(screen.getByRole("button", { name: "Create an Account" }));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
    expect(onCreateAccount).toHaveBeenCalledTimes(1);
  });

  it("hides Remember me and Create an Account when disabled by props", () => {
    render(<LoginForm showRememberMe={false} showCreateAccount={false} />);

    expect(screen.queryByText("Remember me")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create an Account" })
    ).not.toBeInTheDocument();
  });

  it("puts passwordMinLength and passwordMaxLength on the password field", () => {
    render(<LoginForm passwordMinLength={8} passwordMaxLength={32} />);

    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("minLength", "8");
    expect(input).toHaveAttribute("maxLength", "32");
  });

  it("defaults the password length bounds to 6 and 20", () => {
    render(<LoginForm />);

    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("minLength", "6");
    expect(input).toHaveAttribute("maxLength", "20");
  });

  it("keeps submit disabled until the password reaches passwordMinLength", () => {
    const { rerender } = render(
      <LoginForm mobileNumber="9876543210" password="short" />
    );
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

    rerender(<LoginForm mobileNumber="9876543210" password="longer" />);
    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("accepts any non-empty password when passwordMinLength is 0", () => {
    render(
      <LoginForm mobileNumber="9876543210" password="a" passwordMinLength={0} />
    );

    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("lets an explicit disabled prop override the length gate", () => {
    render(
      <LoginForm mobileNumber="9876543210" password="x" disabled={false} />
    );

    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("applies custom className and spreads extra props", () => {
    const { container } = render(
      <LoginForm className="custom-form" data-testid="login-form" />
    );

    expect(screen.getByTestId("login-form")).toHaveClass("custom-form");
    assertNoBootstrapMarginBleed(container);
  });

  it("forwards the ref to the form element", () => {
    const ref = { current: null as HTMLFormElement | null };
    render(<LoginForm ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });
});

describe("ForgotPasswordForm", () => {
  it("renders the default copy and submit label", () => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "Forgot Password" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter mobile number to receive OTP")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get OTP" })).toBeDisabled();
  });

  it("enables Get OTP once a mobile number is present and submits", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <ForgotPasswordForm mobileNumber="9876543210" onSubmit={onSubmit} />
    );

    const button = screen.getByRole("button", { name: "Get OTP" });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows the invalid-number validation message", () => {
    render(
      <ForgotPasswordForm
        mobileNumber="98765432"
        mobileError="Please enter a valid mobile number."
      />
    );
    expect(
      screen.getByText("Please enter a valid mobile number.")
    ).toBeInTheDocument();
  });

  it("renders the back affordance only when onBack is provided", () => {
    const onBack = vi.fn();
    const { rerender } = render(<ForgotPasswordForm />);
    expect(
      screen.queryByRole("button", { name: "Go back" })
    ).not.toBeInTheDocument();

    rerender(<ForgotPasswordForm onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref and applies custom className", () => {
    const ref = { current: null as HTMLFormElement | null };
    const { container } = render(
      <ForgotPasswordForm
        ref={ref}
        className="custom-forgot"
        data-testid="forgot-form"
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(screen.getByTestId("forgot-form")).toHaveClass("custom-forgot");
    assertNoBootstrapMarginBleed(container);
  });
});

describe("OtpInput", () => {
  it("renders the requested number of boxes", () => {
    render(<OtpInput length={6} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("splits the value across the boxes", () => {
    render(<OtpInput value="98" />);
    const boxes = screen.getAllByRole("textbox");
    expect(boxes[0]).toHaveValue("9");
    expect(boxes[1]).toHaveValue("8");
    expect(boxes[2]).toHaveValue("");
  });

  it("emits the accumulated value on typing", () => {
    const onChange = vi.fn();
    render(<OtpInput value="9" onChange={onChange} />);

    fireEvent.change(screen.getAllByRole("textbox")[1], {
      target: { value: "8" },
    });
    expect(onChange).toHaveBeenCalledWith("98");
  });

  it("ignores non-numeric input", () => {
    const onChange = vi.fn();
    render(<OtpInput onChange={onChange} />);

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "a" },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onComplete once every digit is filled", () => {
    const onComplete = vi.fn();
    render(<OtpInput value="987" onComplete={onComplete} />);

    fireEvent.change(screen.getAllByRole("textbox")[3], {
      target: { value: "6" },
    });
    expect(onComplete).toHaveBeenCalledWith("9876");
  });

  it("clears the current digit on Backspace", () => {
    const onChange = vi.fn();
    render(<OtpInput value="98" onChange={onChange} />);

    fireEvent.keyDown(screen.getAllByRole("textbox")[1], {
      key: "Backspace",
    });
    expect(onChange).toHaveBeenCalledWith("9");
  });

  it("clears the previous digit when Backspace is pressed in an empty box", () => {
    const onChange = vi.fn();
    render(<OtpInput value="98" onChange={onChange} />);

    fireEvent.keyDown(screen.getAllByRole("textbox")[2], {
      key: "Backspace",
    });
    expect(onChange).toHaveBeenCalledWith("9");
  });

  it("distributes a pasted code across the boxes", () => {
    const onChange = vi.fn();
    render(<OtpInput onChange={onChange} />);

    fireEvent.paste(screen.getAllByRole("textbox")[0], {
      clipboardData: { getData: () => "9876" },
    });
    expect(onChange).toHaveBeenCalledWith("9876");
  });

  it("applies error classes and aria-invalid to every box", () => {
    render(<OtpInput hasError />);
    screen.getAllByRole("textbox").forEach((box) => {
      expect(box).toHaveClass("border-semantic-error-primary");
      expect(box).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("applies default border classes when there is no error", () => {
    render(<OtpInput />);
    expect(screen.getAllByRole("textbox")[0]).toHaveClass(
      "border-semantic-border-input"
    );
  });

  it("disables every box when disabled", () => {
    render(<OtpInput disabled />);
    screen.getAllByRole("textbox").forEach((box) => {
      expect(box).toBeDisabled();
    });
  });

  it("applies custom className and forwards the ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<OtpInput ref={ref} className="custom-otp" data-testid="otp" />);

    expect(screen.getByTestId("otp")).toHaveClass("custom-otp");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("OtpVerificationForm", () => {
  it("generates the description from the masked destination", () => {
    render(<OtpVerificationForm maskedDestination="* * * * * 43210" />);

    expect(
      screen.getByRole("heading", { name: "OTP Verification" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter the 4-digit code sent to * * * * * 43210. Valid for 10 minutes."
      )
    ).toBeInTheDocument();
  });

  it("disables Verify OTP until the code is complete", () => {
    const { rerender } = render(<OtpVerificationForm otp="98" />);
    expect(screen.getByRole("button", { name: "Verify OTP" })).toBeDisabled();

    rerender(<OtpVerificationForm otp="9876" />);
    expect(screen.getByRole("button", { name: "Verify OTP" })).toBeEnabled();
  });

  it("renders the OTP error with the attempt counter", () => {
    render(
      <OtpVerificationForm
        otp="9876"
        otpError="Incorrect OTP. Try again."
        attemptsLeft={5}
        attemptsTotal={6}
      />
    );

    expect(screen.getByText("Incorrect OTP. Try again.")).toBeInTheDocument();
    expect(screen.getByText("5 of 6 attempts left")).toBeInTheDocument();
  });

  it("offers the call channel when the OTP was sent over SMS", () => {
    const onChannelSwitch = vi.fn();
    render(
      <OtpVerificationForm channel="sms" onChannelSwitch={onChannelSwitch} />
    );

    fireEvent.click(screen.getByRole("button", { name: /OTP via call/ }));
    expect(onChannelSwitch).toHaveBeenCalledWith("call");
  });

  it("offers the message channel when the OTP was sent over a call", () => {
    const onChannelSwitch = vi.fn();
    render(
      <OtpVerificationForm channel="call" onChannelSwitch={onChannelSwitch} />
    );

    fireEvent.click(screen.getByRole("button", { name: /OTP via message/ }));
    expect(onChannelSwitch).toHaveBeenCalledWith("sms");
  });

  it("hides the channel switch when showChannelSwitch is false", () => {
    render(<OtpVerificationForm showChannelSwitch={false} />);
    expect(
      screen.queryByRole("button", { name: /OTP via/ })
    ).not.toBeInTheDocument();
  });

  it("blocks resend while the countdown is running", () => {
    render(<OtpVerificationForm resendIn={30} />);

    const resend = screen.getByRole("button", { name: /Resend OTP/ });
    expect(resend).toBeDisabled();
    expect(screen.getByText("in 30s")).toBeInTheDocument();
  });

  it("enables resend once the countdown reaches zero", () => {
    const onResend = vi.fn();
    render(<OtpVerificationForm resendIn={0} onResend={onResend} />);

    const resend = screen.getByRole("button", { name: "Resend OTP" });
    expect(resend).toBeEnabled();
    fireEvent.click(resend);
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  it("submits when Verify OTP is pressed", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(<OtpVerificationForm otp="9876" onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Verify OTP" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("supports a 6-digit code", () => {
    render(<OtpVerificationForm otpLength={6} maskedDestination="43210" />);

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(
      screen.getByText(
        "Enter the 6-digit code sent to 43210. Valid for 10 minutes."
      )
    ).toBeInTheDocument();
  });

  it("applies custom className, spreads props, and forwards the ref", () => {
    const ref = { current: null as HTMLFormElement | null };
    const { container } = render(
      <OtpVerificationForm
        ref={ref}
        className="custom-otp-form"
        data-testid="otp-form"
      />
    );

    expect(screen.getByTestId("otp-form")).toHaveClass("custom-otp-form");
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    assertNoBootstrapMarginBleed(container);
  });
});

describe("ResetPasswordForm", () => {
  it("renders the default copy and field", () => {
    render(<ResetPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "Reset Password" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must be of 6-20 alphanumeric characters.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter new password")
    ).toBeInTheDocument();
  });

  it("disables the submit button until a password is entered", () => {
    const { rerender } = render(<ResetPasswordForm />);
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeDisabled();

    rerender(<ResetPasswordForm password="secret123" />);
    expect(screen.getByRole("button", { name: "Reset Password" })).toBeEnabled();
  });

  it("fires onPasswordChange and onSubmit", () => {
    const onPasswordChange = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <ResetPasswordForm
        password="secret123"
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: { value: "newsecret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(onPasswordChange).toHaveBeenCalledWith("newsecret1");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("enforces the min and max length on the input", () => {
    render(<ResetPasswordForm />);
    const input = screen.getByPlaceholderText("Enter new password");

    expect(input).toHaveAttribute("minLength", "6");
    expect(input).toHaveAttribute("maxLength", "20");
  });

  it("reveals the password when showPassword is set", () => {
    render(<ResetPasswordForm password="secret123" showPassword />);
    expect(screen.getByDisplayValue("secret123")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("renders the password error", () => {
    render(
      <ResetPasswordForm passwordError="Password must be 6-20 characters." />
    );
    expect(
      screen.getByText("Password must be 6-20 characters.")
    ).toBeInTheDocument();
  });

  it("applies custom className and forwards the ref", () => {
    const ref = { current: null as HTMLFormElement | null };
    const { container } = render(
      <ResetPasswordForm
        ref={ref}
        className="custom-reset"
        data-testid="reset-form"
      />
    );

    expect(screen.getByTestId("reset-form")).toHaveClass("custom-reset");
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    assertNoBootstrapMarginBleed(container);
  });
});

describe("Login", () => {
  it("renders the login step by default", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter mobile number")
    ).toBeInTheDocument();
  });

  it("renders the forgot-password step", () => {
    render(<Login step="forgot-password" />);

    expect(
      screen.getByRole("heading", { name: "Forgot Password" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get OTP" })).toBeInTheDocument();
  });

  it("renders the otp step", () => {
    render(<Login step="otp" maskedDestination="* * * * * 43210" />);

    expect(
      screen.getByRole("heading", { name: "OTP Verification" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("renders the reset-password step", () => {
    render(<Login step="reset-password" />);

    expect(
      screen.getByRole("heading", { name: "Reset Password" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter new password")
    ).toBeInTheDocument();
  });

  it("overrides the title, description, and submit label", () => {
    render(
      <Login
        title="Welcome back"
        description="Sign in to continue"
        submitLabel="Sign in"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("wires step callbacks through to the active form", () => {
    const onForgotPassword = vi.fn();
    render(<Login onForgotPassword={onForgotPassword} />);

    fireEvent.click(screen.getByRole("button", { name: "Forgot Password?" }));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("forwards layout props and the ref to the shell", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <Login
        ref={ref}
        logoSrc="/logo.svg"
        className="custom-login"
        data-testid="login"
      />
    );

    expect(screen.getByTestId("login")).toHaveClass("custom-login");
    expect(screen.getByAltText("MyOperator")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    assertNoBootstrapMarginBleed(container);
  });
});

describe("uncontrolled usage", () => {
  it("lets the user type into the mobile number with no value prop", () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText("Enter mobile number");

    fireEvent.change(input, { target: { value: "9876543210" } });
    expect(input).toHaveValue("9876543210");
  });

  it("lets the user type into the password with no value prop", () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText("Enter password");

    fireEvent.change(input, { target: { value: "supersecret" } });
    expect(input).toHaveValue("supersecret");
  });

  it("enables the submit button once both fields are typed into", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Enter mobile number"), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "supersecret" },
    });

    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("still reports changes through the callbacks while uncontrolled", () => {
    const onMobileNumberChange = vi.fn();
    render(<LoginForm onMobileNumberChange={onMobileNumberChange} />);

    fireEvent.change(screen.getByPlaceholderText("Enter mobile number"), {
      target: { value: "98765" },
    });
    expect(onMobileNumberChange).toHaveBeenCalledWith("98765");
  });

  it("toggles password visibility without an onTogglePassword handler", () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByPlaceholderText("Enter password")).toHaveAttribute(
      "type",
      "text"
    );

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByPlaceholderText("Enter password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("toggles Remember me without an onRememberMeChange handler", () => {
    render(<LoginForm />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    fireEvent.click(checkbox);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "data-state",
      "checked"
    );
  });

  it("keeps a controlled value pinned when the host owns it", () => {
    render(<LoginForm mobileNumber="9876543210" />);
    const input = screen.getByPlaceholderText("Enter mobile number");

    fireEvent.change(input, { target: { value: "1111111111" } });
    expect(input).toHaveValue("9876543210");
  });

  it("lets the user type into the reset-password field with no value prop", () => {
    render(<ResetPasswordForm />);
    const input = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(input, { target: { value: "newsecret1" } });
    expect(input).toHaveValue("newsecret1");
    expect(screen.getByRole("button", { name: "Reset Password" })).toBeEnabled();
  });

  it("lets the user type into the forgot-password field with no value prop", () => {
    render(<ForgotPasswordForm />);
    const input = screen.getByPlaceholderText("Enter mobile number");

    fireEvent.change(input, { target: { value: "9876543210" } });
    expect(input).toHaveValue("9876543210");
    expect(screen.getByRole("button", { name: "Get OTP" })).toBeEnabled();
  });

  it("lets the user type an OTP with no value prop", () => {
    render(<OtpInput autoFocus={false} />);
    const boxes = screen.getAllByRole("textbox");

    fireEvent.change(boxes[0], { target: { value: "9" } });
    expect(boxes[0]).toHaveValue("9");
    fireEvent.change(boxes[1], { target: { value: "8" } });
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("8");
  });

  it("enables Verify OTP once a full code is typed with no value prop", () => {
    render(<OtpVerificationForm />);
    expect(screen.getByRole("button", { name: "Verify OTP" })).toBeDisabled();

    const boxes = screen.getAllByRole("textbox");
    fireEvent.paste(boxes[0], {
      clipboardData: { getData: () => "9876" },
    });

    expect(screen.getByRole("button", { name: "Verify OTP" })).toBeEnabled();
  });

  it("fires onOtpComplete while uncontrolled", () => {
    const onOtpComplete = vi.fn();
    render(<OtpVerificationForm onOtpComplete={onOtpComplete} />);

    fireEvent.paste(screen.getAllByRole("textbox")[0], {
      clipboardData: { getData: () => "9876" },
    });
    expect(onOtpComplete).toHaveBeenCalledWith("9876");
  });

  it("lets the user type through the Login orchestrator with no value props", () => {
    render(<Login />);
    const input = screen.getByPlaceholderText("Enter mobile number");

    fireEvent.change(input, { target: { value: "9876543210" } });
    expect(input).toHaveValue("9876543210");
  });
});

describe("marketing illustration", () => {
  it("renders the bundled artwork by default", () => {
    const { container } = render(
      <AuthLayout>
        <span />
      </AuthLayout>
    );

    const art = container.querySelector('img[src^="data:image/png;base64,"]');
    expect(art).toBeInTheDocument();
    expect(art).toHaveAttribute("width", "618");
    expect(art).toHaveAttribute("height", "368");
  });

  it("treats the bundled artwork as decorative", () => {
    const { container } = render(
      <AuthLayout>
        <span />
      </AuthLayout>
    );

    const art = container.querySelector('img[src^="data:image/png;base64,"]');
    expect(art).toHaveAttribute("alt", "");
  });

  it("uses a caller-supplied illustrationSrc instead", () => {
    const { container } = render(
      <AuthLayout illustrationSrc="https://cdn.example.com/hero.png">
        <span />
      </AuthLayout>
    );

    expect(
      container.querySelector('img[src="https://cdn.example.com/hero.png"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('img[src^="data:image/png;base64,"]')
    ).not.toBeInTheDocument();
  });

  it("accepts illustrationAlt for meaningful artwork", () => {
    render(
      <AuthLayout
        illustrationSrc="https://cdn.example.com/hero.png"
        illustrationAlt="MyOperator inbox"
      >
        <span />
      </AuthLayout>
    );

    expect(screen.getByAltText("MyOperator inbox")).toBeInTheDocument();
  });

  it("renders no artwork when illustrationSrc is null", () => {
    const { container } = render(
      <AuthLayout illustrationSrc={null}>
        <span />
      </AuthLayout>
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(
      screen.getByText("Continue managing conversations efficiently")
    ).toBeInTheDocument();
  });

  it("lets an illustration node override illustrationSrc", () => {
    const { container } = render(
      <AuthLayout
        illustration={<span>custom art</span>}
        illustrationSrc="https://cdn.example.com/hero.png"
      >
        <span />
      </AuthLayout>
    );

    expect(screen.getByText("custom art")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("drops the artwork along with the panel when hidden", () => {
    const { container } = render(
      <AuthLayout hideMarketingPanel>
        <span />
      </AuthLayout>
    );

    expect(
      container.querySelector('img[src^="data:image/png;base64,"]')
    ).not.toBeInTheDocument();
  });

  it("passes illustration props through the Login orchestrator", () => {
    const { container } = render(
      <Login illustrationSrc="https://cdn.example.com/hero.png" />
    );

    expect(
      container.querySelector('img[src="https://cdn.example.com/hero.png"]')
    ).toBeInTheDocument();
  });
});

describe("autofocus does not scroll the page", () => {
  it("focuses the first OTP box with preventScroll on mount", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpInput />);

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  it("advances focus with preventScroll while typing", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpInput autoFocus={false} />);
    focusSpy.mockClear();

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "9" },
    });

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(
      focusSpy.mock.calls.every(([options]) => options?.preventScroll === true)
    ).toBe(true);
    focusSpy.mockRestore();
  });

  it("never calls focus without options", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpInput />);
    fireEvent.keyDown(screen.getAllByRole("textbox")[0], { key: "ArrowRight" });

    expect(focusSpy).toHaveBeenCalled();
    expect(focusSpy.mock.calls.some(([options]) => options === undefined)).toBe(
      false
    );
    focusSpy.mockRestore();
  });

  it("does not focus at all when autoFocus is false", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpInput autoFocus={false} />);

    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("honours autoFocusOtp={false} on the OTP step", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpVerificationForm autoFocusOtp={false} />);

    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("autofocuses the OTP step by default", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<OtpVerificationForm />);

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  it("passes autoFocusOtp through the Login orchestrator", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    render(<Login step="otp" autoFocusOtp={false} />);

    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});

describe("full-screen 50/50 layout", () => {
  it("splits into two equal columns at lg and above", () => {
    render(
      <AuthLayout data-testid="layout">
        <span />
      </AuthLayout>
    );

    const layout = screen.getByTestId("layout");
    expect(layout).toHaveClass("grid", "grid-cols-1", "lg:grid-cols-2");
    expect(layout).toHaveClass("min-h-screen", "w-full");
  });

  it("collapses to a single column when the marketing panel is hidden", () => {
    render(
      <AuthLayout hideMarketingPanel data-testid="layout">
        <span />
      </AuthLayout>
    );

    const layout = screen.getByTestId("layout");
    expect(layout).toHaveClass("grid-cols-1");
    expect(layout).not.toHaveClass("lg:grid-cols-2");
  });

  it("keeps the grid itself edge-to-edge so each half bleeds to the screen edge", () => {
    render(
      <AuthLayout data-testid="layout">
        <span />
      </AuthLayout>
    );

    const classes = screen.getByTestId("layout").className.split(/\s+/);
    // No horizontal padding or column gap on the grid — otherwise the marketing
    // panel's background stops short of the viewport edge.
    expect(classes.some((c) => /^(lg:)?px-/.test(c))).toBe(false);
    expect(classes.some((c) => /^(lg:)?gap-x?-/.test(c))).toBe(false);
  });

  it("gives the marketing panel its own full-height surface", () => {
    const { container } = render(
      <AuthLayout>
        <span />
      </AuthLayout>
    );

    // Figma node 2900:46955 — the marketing half uses the cool slate canvas
    // (#F1F5F9), not the warm `bg-ui` neutral (#F5F5F5).
    const panel = container.querySelector(".bg-semantic-bg-canvas");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass("hidden", "lg:flex", "justify-center");
  });

  it("constrains the form card without constraining its half", () => {
    const { container } = render(
      <AuthLayout>
        <span data-testid="card-child" />
      </AuthLayout>
    );

    const card = screen.getByTestId("card-child").parentElement;
    expect(card).toHaveClass("w-full", "max-w-[576px]");
    expect(container.firstElementChild).toHaveClass("lg:grid-cols-2");
  });
});

describe("Figma spec — login card", () => {
  it("always renders Forgot Password?, with or without a handler", () => {
    const { rerender } = render(<LoginForm />);
    expect(
      screen.getByRole("button", { name: "Forgot Password?" })
    ).toBeInTheDocument();

    const onForgotPassword = vi.fn();
    rerender(<LoginForm onForgotPassword={onForgotPassword} />);
    fireEvent.click(screen.getByRole("button", { name: "Forgot Password?" }));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("right-aligns Forgot Password? under the password field", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Forgot Password?" })).toHaveClass(
      "ml-auto"
    );
  });

  it("renders Remember me at the Figma 12px regular spec", () => {
    render(<LoginForm />);
    const label = screen.getByText("Remember me");

    expect(label).toHaveClass("text-xs", "font-normal");
    expect(label).toHaveClass("text-semantic-text-primary");
  });

  it("uses a 14px checkbox box with a 1px border and an 8px tick", () => {
    render(<LoginForm />);
    const box = screen.getByRole("checkbox");

    // Figma node I2913:16925;251:8591 — 14px box, 4px radius, 1px border so the
    // tick is not squeezed by the default 2px border at this size.
    expect(box).toHaveClass("size-3.5", "rounded", "border");
    // Check inset 21.43% of 14px => an 8px glyph, not the default 14px one.
    expect(box).toHaveClass("[&_svg]:size-2", "[&_svg]:stroke-[2.5]");
  });

  it("gives the disabled submit button the flat Figma grey", () => {
    render(<LoginForm />);
    const submit = screen.getByRole("button", { name: "Login" });

    expect(submit).toBeDisabled();
    expect(submit).toHaveClass(
      "disabled:bg-semantic-disabled-primary",
      "disabled:opacity-100"
    );
    expect(submit).toHaveClass("h-12", "w-full");
  });

  it("matches the Figma outline colour on Create an Account", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("button", { name: "Create an Account" })
    ).toHaveClass("border-[var(--color-primary-100)]", "h-12", "w-full");
  });

  it("uses the Figma vertical rhythm inside the card", () => {
    const { container } = render(<LoginForm />);
    const form = container.querySelector("form");

    // Figma: card gap 24, form gap 24, label→field 2, field→link 6, actions 16
    expect(form).toHaveClass("gap-6");
    expect(form?.querySelector(".gap-0\\.5")).toBeInTheDocument();
    expect(form?.querySelector(".gap-1\\.5")).toBeInTheDocument();
    expect(form?.querySelector(".gap-4")).toBeInTheDocument();
  });

  it("keeps the disabled-grey treatment on every step's submit button", () => {
    const cases = [
      [<ForgotPasswordForm key="f" />, "Get OTP"],
      [<OtpVerificationForm key="o" />, "Verify OTP"],
      [<ResetPasswordForm key="r" />, "Reset Password"],
    ] as const;

    for (const [element, label] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole("button", { name: label })).toHaveClass(
        "disabled:bg-semantic-disabled-primary"
      );
      unmount();
    }
  });
});
