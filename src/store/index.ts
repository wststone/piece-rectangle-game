import { configureStore, combineReducers } from "@reduxjs/toolkit";
import GameLevelStatus from "./modules/GameLevelStatus";

const ReducerRoot = combineReducers({ GameLevelStatus });
const RootStore = configureStore({ reducer: ReducerRoot });

export type rootStateType = ReturnType<typeof ReducerRoot>;

export default RootStore;
