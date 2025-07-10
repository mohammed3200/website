"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

interface Credentials {
  email: string;
  password: string;
}

export function CredentialsSignIn() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Credentials>();

  const onSubmit = async (credentials: Credentials) => {
    await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}