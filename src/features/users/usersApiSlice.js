import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const usersAdapter = createEntityAdapter({});
// to get normalize state, to use id to get entity (organized array in db)
const initialState = usersAdapter.getInitialState();
//if initial state exist, get initial state

export const usersApiSlice = apiSlice.injectEndpoints({
  // inject query to api
  endpoints: (builder) => ({
    // create end point
    getUsers: builder.query({
      // create getUser query method
      query: () => "/users", // query for url
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, // default is 60 sec cached bt RTK
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id; // transform _id form db to id
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
        // save new users with id
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          // err handling if res without id
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

// useGetUsersQuery hook automatically created based on the query
// method name is wes given

//returns query result
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState // if null go initial state
);
