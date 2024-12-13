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

export default function Register() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom); // Get and set the auth state from Jotai
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerMutation = api.user.register.useMutation();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    registerMutation.mutate({ name, email, password });
  };

  // Handle login success or failure
  useEffect(() => {
    if (registerMutation.isSuccess && registerMutation.data?.isAuthenticated) {
      const { email, id } = registerMutation.data;
      setAuth({ email, id, isAuthenticated: true });
      router.push("/dashboard");
    }

    if (registerMutation.isError) {
      setError("Invalid email or password"); // Set custom error message
    }
  }, [
    registerMutation.isSuccess,
    registerMutation.isError,
    registerMutation.data,
    router,
    setAuth,
  ]);

  return (
    <div className="w-full bg-blue-100">
      <Title className="mb-12 text-center">Register Now!</Title>

      <Paper p="lg" shadow="xs" w={400} className="mx-auto">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Ted"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            mb="md"
          />

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
            <Button
              fullWidth
              type="button"
              variant="subtle"
              onClick={() => router.push("/login")}
              disabled={registerMutation.isPending}
            >
              Login
            </Button>
            <Button
              fullWidth
              type="submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
