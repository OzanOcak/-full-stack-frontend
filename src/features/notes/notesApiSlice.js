import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1, // to show completed tickets last
});
// to get normalize state, to use id to get entity (organized array in db)
const initialState = notesAdapter.getInitialState();
//if initial state exist, get initial state

export const notesApiSlice = apiSlice.injectEndpoints({
  // inject query to api
  endpoints: (builder) => ({
    // create end point
    getNotes: builder.query({
      // create getNote query method
      query: () => "/notes", // query for url
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, // default is 60 sec cached bt RTK
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id; // transform _id form db to id
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
        // save new notes with id
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          // err handling if res without id
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetNotesQuery } = notesApiSlice;

// useGetNotesQuery hook automatically created based on the query
// method name  was given

//returns query result
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState // if null go initial state
);
