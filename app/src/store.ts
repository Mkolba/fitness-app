import {atom} from "@mntm/precoil";
import React from "react";
import {IUser} from "./types";

export const popoutAtom = atom<React.ReactNode>(undefined);
export const userAtom = atom<IUser | undefined>(undefined);