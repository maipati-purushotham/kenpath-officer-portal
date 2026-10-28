import { z } from "zod";

// ---------- Application status ----------
export const AppStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "returned",
]);
export type AppStatus = z.infer<typeof AppStatusSchema>;

// ---------- Document ----------
export const DocumentSchema = z.object({
  name: z.string().min(1),
  nameTe: z.string().min(1),
  submitted: z.boolean(),
});
export type DocumentItem = z.infer<typeof DocumentSchema>;

// ---------- Application ----------
export const ApplicationSchema = z.object({
  id: z.string().regex(/^APP-\d{4}-\d{3}$/, "Invalid application ID format"),
  applicantName: z.string().min(1),
  applicantNameTe: z.string().min(1),
  type: z.string().min(1),
  typeTe: z.string().min(1),
  surveyNumber: z.string().min(1),
  village: z.string().min(1),
  submittedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  status: AppStatusSchema,
  documents: z.array(DocumentSchema).min(1),
  notes: z.string(),
  notesTe: z.string(),
  daysOld: z.number().int().nonnegative(),
});
export type Application = z.infer<typeof ApplicationSchema>;

// ---------- AI request / response ----------
export const AIRequestSchema = z.object({
  applicationId: z.string().min(1),
});
export type AIRequest = z.infer<typeof AIRequestSchema>;

export const AIResponseSchema = z.object({
  summaryTe: z.string(),
  missingDocuments: z.array(z.string()),
  inconsistencies: z.array(z.string()),
  suggestedDecision: z.enum(["approve", "reject", "return"]),
  reasonsTe: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});
export type AIResult = z.infer<typeof AIResponseSchema>;

// ---------- Decision ----------
export const DecisionRequestSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["approved", "rejected", "returned"]),
  remarks: z
    .string()
    .min(5, "వ్యాఖ్యలు కనీసం 5 అక్షరాలు ఉండాలి")
    .max(500, "వ్యాఖ్యలు 500 అక్షరాలకు మించకూడదు"),
});
export type DecisionRequest = z.infer<typeof DecisionRequestSchema>;

// ---------- Login ----------
export const LoginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});
export type LoginInput = z.infer<typeof LoginSchema>;
