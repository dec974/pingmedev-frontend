import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    username: null,
    email: null,
    token: null,
    id: null,
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
    signOut: (state) => {
      state.value = initialState.value;
    },
    setUserId: (state, action) => {
      // Nouvelle action pour définir l'ID utilisateur
      state.value.id = action.payload;
    },
  },
});

export const { signIn, signUp, signOut, setUserId } = userSlice.actions;
export default userSlice.reducer;
