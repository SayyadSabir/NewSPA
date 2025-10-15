import { http, HttpResponse } from "msw";
import { PersonalDetails } from "../../features/financial-details/api/personalDetailsApi";

// Mock personal details data
const mockPersonalDetails: PersonalDetails = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1980-05-15", // This would make the person around 45 years old
  email: "john.doe@example.com",
  phone: "555-123-4567",
};

export const personalDetailsHandlers = [
  http.get("/api/personal-details", () => {
    return HttpResponse.json(mockPersonalDetails);
  }),
];
