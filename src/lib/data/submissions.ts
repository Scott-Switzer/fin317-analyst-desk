import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface SubmissionInput {
  studentId: string;
  missionVersionId: string;
  classId?: string;
  submissionJson: Record<string, unknown>;
  score: number;
  maxScore: number;
  status?: string;
}

export async function saveSubmission(input: SubmissionInput) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("submissions")
    .insert({
      student_id: input.studentId,
      mission_version_id: input.missionVersionId,
      class_id: input.classId,
      submission_json: input.submissionJson,
      score: input.score,
      max_score: input.maxScore,
      status: input.status || "submitted",
    })
    .select()
    .single();
  if (error) return null;
  return data;
}

export async function fetchSubmissionsForClass(classId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("submissions")
    .select("*, profiles(full_name)")
    .eq("class_id", classId)
    .order("submitted_at", { ascending: false });
  if (error) return null;
  return data;
}

export async function fetchSubmissionsForStudent(studentId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("submissions")
    .select("*")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });
  if (error) return null;
  return data;
}
