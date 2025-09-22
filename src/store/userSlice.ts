import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    email: string;
    accessToken: string;
}

interface UserState {
    currentUser: User | null;
}

const initialState: UserState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            console.log("Hydrating Redux with user:", action.payload);

            state.currentUser = action.payload;
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
