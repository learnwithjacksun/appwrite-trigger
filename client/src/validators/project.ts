import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  appwriteEndpoint: z.url("Enter a valid Appwrite endpoint URL"),
  projectId: z.string().min(1, "Project ID is required"),
  apiKey: z.string().optional(),
  autoPingEnabled: z.boolean(),
});

export const createProjectSchema = projectFormSchema.extend({
  apiKey: z.string().min(1, "API key is required"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
