import { supabase } from "./supabase";

const MODERATOR_DEPARTMENT_KEY = "city_engineering_office";

export async function getUnreadModeratorNotificationCount() {
  const { count, error } = await supabase
    .from("moderator_notifications")
    .select("*", { count: "exact", head: true })
    .eq("department_key", MODERATOR_DEPARTMENT_KEY)
    .eq("is_read", false);

  if (error) {
    console.log("Unread count error:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getModeratorNotifications() {
  const { data, error } = await supabase
    .from("moderator_notifications")
    .select("*")
    .eq("department_key", MODERATOR_DEPARTMENT_KEY)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Fetch notifications error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function markModeratorNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from("moderator_notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  if (error) {
    console.log("Mark notification read error:", error.message);
  }
}

export function subscribeToModeratorNotifications(onChange) {
  const channel = supabase
    .channel("moderator-notifications-city-engineering")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "moderator_notifications",
        filter: `department_key=eq.${MODERATOR_DEPARTMENT_KEY}`,
      },
      async () => {
        const unreadCount = await getUnreadModeratorNotificationCount();
        const notifications = await getModeratorNotifications();

        onChange({
          unreadCount,
          notifications,
        });
      }
    )
    .subscribe((status) => {
      console.log("Moderator notification realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}