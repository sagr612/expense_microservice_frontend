export type UserInfoDto = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: number;
  email?: string;
  profile_pic?: string;
  profile_image_public_id?: string;
};

export interface UserContextType {
  user: UserInfoDto | null;
  isLoading: boolean;
  deleteUser: (userId: string) => Promise<void>;
  getUser: (userId: string) => Promise<void>;
  createUpdateUser: (userInfo: UserInfoDto) => Promise<void>;
  uploadAvatar: (userId: string, formData: FormData) => Promise<void>;
}

type SettingsIconName =
  | "person-outline"
  | "image-outline"
  | "lock-closed-outline"
  | "cash-outline"
  | "notifications-outline";

interface SettingsItem {
  id: string;
  icon: SettingsIconName;
  label: string;
  value: string;
  onPress: () => void;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}
