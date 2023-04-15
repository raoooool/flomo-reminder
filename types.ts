export type Memo = {
  content: string;
  created_at: string;
  creator_id: number;
  deleted_at: number | null;
  files: any[];
  linked_count: number;
  pin: number;
  slug: string;
  source: string;
  tags: string[];
  updated_at: string;
};
