import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";
import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import { auth } from "../config/firebase";
import { AlertState, Severity } from "../types/AlertState";

interface RootState {}

interface RootAction {}

interface RootThunk {}

export interface RootStore extends RootState, RootAction, RootThunk {}

export const rootStore = createStore<RootStore>({});
