import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://vjzqlhdzxnkwfitkwpet.supabase.co";
const supabaseAnonKey = "sb_publishable_zhrEv7JJZFQiHVggRsy5nA_7NhAlFWs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
