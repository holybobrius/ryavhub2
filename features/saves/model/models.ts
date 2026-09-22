export interface SaveListItem {
  id: number;
  name: string;
  imageUrl: string;
  year: number;
  version?: string | null;
  size?: string | null;
  downloadUrl?: string | null;
}
