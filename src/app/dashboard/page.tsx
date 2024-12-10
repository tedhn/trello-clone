"use client";
import { useRouter } from "next/navigation";
import { Button, Container, Title, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/atoms";

export default function Dashboard() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);

  const handleLogout = () => {
    setAuth({ email: "", isAuthenticated: false });
    router.push("/login");
  };

  return (
    <Container size={600} my={40}>
      <Title className="text-center">Welcome to your Dashboard!</Title>
      <Text className="text-center" size="lg">
        You are logged in as: {auth.email}
      </Text>
      <Button fullWidth mt={30} color="red" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}
