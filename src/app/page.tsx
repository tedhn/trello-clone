import { Provider } from "jotai";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("login");

  return (
    <HydrateClient>
      <Provider>A</Provider>
    </HydrateClient>
  );
}
