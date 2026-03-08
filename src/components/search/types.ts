export type SearchCategory = "all" | "student" | "teacher" | "class" | "subject" | "announcement" | "exam" | "homework";

export interface SearchResult {
  id: string;
  type: SearchCategory;
  title: string;
  description: string;
  avatar?: string | null;
  link: string;
}
