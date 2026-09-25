import { handleFormSubmission } from "@/lib/form-submission";

export async function POST(request: Request) {
  return handleFormSubmission(request, "feedback");
}
