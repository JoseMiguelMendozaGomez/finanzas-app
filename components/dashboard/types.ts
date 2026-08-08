export interface DashboardUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  /** Timestamp de la última foto de perfil subida — undefined si no tiene */
  avatarUpdatedAt?: number;
}
