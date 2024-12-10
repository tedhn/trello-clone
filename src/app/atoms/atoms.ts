import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ListWithTasks } from "~/server/types";

export const authAtom = atomWithStorage("auth", {
  email: "",
  isAuthenticated: false,
  id: "",
});

export const listAtom = atom<ListWithTasks[]>([]);

export const editListModalAtom = atom<{
  isOpen: boolean;
  listId: string | null;
  list: ListWithTasks | null;
}>({
  isOpen: false,
  listId: null,
  list: null,
});
export const deleteListModalAtom = atom<{
  isOpen: boolean;
  listId: string | null;
}>({
  isOpen: false,
  listId: null,
});
