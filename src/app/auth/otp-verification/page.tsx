"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyLoginOtp } from "@/hooks/useVerifyLoginOtp";
import { useSearchParams, useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().length(6, {
    message: "Your one-time password must be 6 digits.",
  }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function OtpVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mobile = searchParams.get("mobile") || "";

  const otpVerificationMutation = useVerifyLoginOtp();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(data: OtpFormValues) {
    otpVerificationMutation.mutate(
      { otp: data.otp, mobile },
      {
        onSuccess: (res) => {
          toast.success("OTP verified successfully ✅");
          // store token, set auth state, redirect etc
          // localStorage.setItem("token", res.token)
          router.push("/dashboard");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "OTP verification failed");
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Enter OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {mobile}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={otpVerificationMutation.isPending}
            >
              {otpVerificationMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
