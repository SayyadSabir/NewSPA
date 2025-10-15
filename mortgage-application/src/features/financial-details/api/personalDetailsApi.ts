import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date string
  email: string;
  phone: string;
}

export const personalDetailsApi = createApi({
  reducerPath: "personalDetailsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["PersonalDetails"],
  endpoints: (builder) => ({
    getPersonalDetails: builder.query<PersonalDetails, void>({
      query: () => "/personal-details",
      providesTags: ["PersonalDetails"],
    }),
  }),
});

export const { useGetPersonalDetailsQuery } = personalDetailsApi;
