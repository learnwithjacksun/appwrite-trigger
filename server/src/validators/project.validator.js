import { z } from "zod";

const projectBody = {
  projectName: z.string().min(2, "Project name must be at least 2 characters").max(100),
  appwriteEndpoint: z.url("Invalid Appwrite endpoint URL"),
  projectId: z.string().min(1, "Appwrite project ID is required"),
  apiKey: z.string().min(1, "API key is required"),
  autoPingEnabled: z.boolean().optional(),
};

export const createProjectSchema = z.object({
  body: z.object(projectBody),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      projectName: z.string().min(2).max(100).optional(),
      appwriteEndpoint: z.url().optional(),
      projectId: z.string().min(1).optional(),
      apiKey: z.string().min(1).optional(),
      autoPingEnabled: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required to update",
    }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listProjectsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional(),
  }),
});

export const pingHistorySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});
