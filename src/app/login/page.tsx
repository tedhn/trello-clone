"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Paper,
  Text,
} from "@mantine/core";
import { api } from "~/trpc/react";
import { authAtom } from "../atoms/atoms";

export default function Login() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom); // Get and set the auth state from Jotai
  const [email, setEmail] = useState("ted@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const loginMutation = api.user.login.useMutation();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    loginMutation.mutate({ email, password });
  };

  // Handle login success or failure
  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data?.isAuthenticated) {
      const { email, id } = loginMutation.data;
      setAuth({ email, id, isAuthenticated: true });
      router.push("/dashboard");
    }

    if (loginMutation.isError) {
      setError("Invalid email or password"); // Set custom error message
    }
  }, [
    loginMutation.isSuccess,
    loginMutation.isError,
    loginMutation.data,
    router,
    setAuth,
  ]);

  return (
    <div className="w-full bg-blue-100">
      <Title className="mb-12 text-center">Welcome Back!</Title>

      <Paper p="lg" shadow="xs" w={400} className="mx-auto">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            mb="md"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mb="md"
          />

          {error && (
            <Text color="red" size="sm" mb="md">
              {error}
            </Text>
          )}

          <div className="flex items-center justify-between gap-4">
            <Button fullWidth type="button" variant="subtle" onClick={() => router.push("/register")}>
              Register
            </Button>
            <Button fullWidth type="submit">
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
