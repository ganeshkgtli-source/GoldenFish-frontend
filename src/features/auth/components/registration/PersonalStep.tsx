import { useState } from "react";
import OtpInput from "./OtpInput";
import {
  User,
  Phone,
  Mail,
//   ChevronDown,
} from "lucide-react";
export default function PersonalStep() {
  const [phoneOtp, setPhoneOtp] = useState("");

  const [emailOtp, setEmailOtp] = useState("");

  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const [phoneLoading, setPhoneLoading] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);

  const handlePhoneVerify = async () => {
    try {
      setPhoneLoading(true);

      // TODO:
      // await sendPhoneOtpApi();

      setTimeout(() => {
        setShowPhoneOtp(true);
        setPhoneLoading(false);
      }, 500);
    } catch {
      setPhoneLoading(false);
    }
  };

  const handleEmailVerify = async () => {
    try {
      setEmailLoading(true);

      // TODO:
      // await sendEmailOtpApi();

      setTimeout(() => {
        setShowEmailOtp(true);
        setEmailLoading(false);
      }, 500);
    } catch {
      setEmailLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      {/* <div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Personal Details
    </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Verify your mobile number and email address
    </p>
  </div> */}

      {/* Full Name */}
 <div>
  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    Full Name
  </label>

  <div className="relative">
    <User
      size={18}
      className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-slate-400
      "
    />

    <input
      type="text"
      placeholder="Enter your full name"
      className="
        w-full
        h-12

        pl-11
        pr-4

        rounded-xl

        border
        border-slate-300
        dark:border-slate-700

        bg-white
        dark:bg-slate-800

        text-slate-900
        dark:text-white

        placeholder:text-slate-400

        outline-none

        focus:border-red-500
        focus:ring-4
        focus:ring-red-500/15

        transition-all
      "
    />
  </div>
</div>

      {/* Phone + Email */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

  {/* PHONE */}
  <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      Phone Number
    </label>

    <div className="flex gap-2">
      <div
        className="
          flex-1
          flex
          h-12

          rounded-xl
          overflow-hidden

          border
          border-slate-300
          dark:border-slate-700

          bg-white
          dark:bg-slate-800
        "
      >
        <div
          className="
            w-12

            flex
            items-center
            justify-center

            border-r
            border-slate-300
            dark:border-slate-700
          "
        >
          <Phone
            size={16}
            className="text-slate-400"
          />
        </div>

        <div
          className="
            px-3

            flex
            items-center
            

            border-r
            border-slate-300
            dark:border-slate-700

            text-sm
            text-slate-700
            dark:text-slate-300
          "
        >
          +91
          {/* <ChevronDown size={14} /> */}
        </div>

        <input
          type="tel"
          placeholder="Enter phone number"
          className="
            flex-1
            px-4

            bg-transparent

            text-slate-900
            dark:text-white

            placeholder:text-slate-400

            outline-none
          "
        />
      </div>

      <button
        type="button"
        onClick={handlePhoneVerify}
        disabled={phoneLoading}
        className="
          h-12
          px-5

          rounded-xl

          bg-red-600
          hover:bg-red-700

          text-white
          text-sm
          font-medium

          disabled:opacity-60

          transition-all
        "
      >
        {phoneLoading
          ? "Sending..."
          : "Verify"}
      </button>
    </div>

    {showPhoneOtp && (
      <div className="space-y-2 animate-in fade-in duration-300">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Enter Phone OTP
        </label>

        <OtpInput
          value={phoneOtp}
          onChange={setPhoneOtp}
        />

        <button
          type="button"
          className="
            text-xs
            text-red-500
            hover:text-red-600
          "
        >
          Resend OTP
        </button>
      </div>
    )}
  </div>

  {/* EMAIL */}
  <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      Email Address
    </label>

    <div className="flex gap-2">
      <div className="relative flex-1">
        <Mail
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2

            text-slate-400
          "
        />

        <input
          type="email"
          placeholder="Enter email address"
          className="
            w-full
            h-12

            pl-11
            pr-4

            rounded-xl

            border
            border-slate-300
            dark:border-slate-700

            bg-white
            dark:bg-slate-800

            text-slate-900
            dark:text-white

            placeholder:text-slate-400

            outline-none

            focus:border-red-500
            focus:ring-4
            focus:ring-red-500/15

            transition-all
          "
        />
      </div>

      <button
        type="button"
        onClick={handleEmailVerify}
        disabled={emailLoading}
        className="
          h-12
          px-5

          rounded-xl

          bg-red-600
          hover:bg-red-700

          text-white
          text-sm
          font-medium

          disabled:opacity-60

          transition-all
        "
      >
        {emailLoading
          ? "Sending..."
          : "Verify"}
      </button>
    </div>

    {showEmailOtp && (
      <div className="space-y-2 animate-in fade-in duration-300">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Enter Email OTP
        </label>

        <OtpInput
          value={emailOtp}
          onChange={setEmailOtp}
        />

        <button
          type="button"
          className="
            text-xs
            text-red-500
            hover:text-red-600
          "
        >
          Resend OTP
        </button>
      </div>
    )}
  </div>

</div>
    </section>
  );
}
