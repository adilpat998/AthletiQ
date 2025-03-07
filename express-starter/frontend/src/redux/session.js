import { csrfFetch } from './csrf';

//Constants
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const removeUser = () => ({
    type: REMOVE_USER
});




export const thunkAuthenticate = () => async (dispatch) => {
    try{
        const response = await csrfFetch("/api/restore-user");
        if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data));
        }
    } catch (e){
        return e
    }
};

export const thunkLogin = (credentials) => async dispatch => {
    const {email, password} = credentials
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({credential: email, password})
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};

export const thunkSignup = (user) => async (dispatch) => {
    try {
        const response = await csrfFetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        dispatch(setUser(data));
        return null;
    } catch (response) {
        try {
            const errorData = await response.json();
            console.log("Signup error:", errorData);
            
            // Check for errors object and return it
            if (errorData.errors) {
                return errorData.errors;
            }
            
            // Fallback to message or generic error
            return { server: errorData.message || "Something went wrong. Please try again" };
        } catch (jsonError) {
            console.error("Error parsing response:", jsonError);
            return { server: "Something went wrong. Please try again" };
        }
    }
};

export const thunkLogout = () => async (dispatch) => {
    await csrfFetch("/api/session", {
        method: "DELETE",
    });
    dispatch(removeUser());
};


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}

export default sessionReducer;
