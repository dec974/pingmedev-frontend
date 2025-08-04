import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    username: null,
    email: null,
    token: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
    signUp: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
  },
});

export const { signIn, signUp, signOut } = userSlice.actions;
export default userSlice.reducer;
