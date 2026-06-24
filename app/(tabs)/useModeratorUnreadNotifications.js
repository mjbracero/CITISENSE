import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "../../lib/supabase";

let cachedModeratorId = null;
let cachedUnreadCount = 0;
let cachedLoading = true;

let globalChannel = null;
let globalChannelModeratorId = null;
let globalIsSettingUp = false;
let refreshTimer = null;

const globalListeners = new Set();

function notifyListeners() {
  globalListeners.forEach((listener) => {
    listener({
      moderatorId: cachedModeratorId,
      unreadCount: cachedUnreadCount,
      loading: cachedLoading,
    });
  });
}

function setGlobalState(nextState = {}) {
  if (Object.prototype.hasOwnProperty.call(nextState, "moderatorId")) {
    cachedModeratorId = nextState.moderatorId;
  }

  if (Object.prototype.hasOwnProperty.call(nextState, "unreadCount")) {
    cachedUnreadCount = nextState.unreadCount;
  }

  if (Object.prototype.hasOwnProperty.call(nextState, "loading")) {
    cachedLoading = nextState.loading;
  }

  notifyListeners();
}

async function getCurrentModeratorId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    return null;
  }

  return user.id;
}

async function fetchUnreadCount(moderatorId) {
  if (!moderatorId) return 0;

  const { count, error } = await supabase
    .from("moderator_notifications")
    .select("*", { count: "exact", head: true })
    .eq("moderator_id", moderatorId)
    .eq("is_read", false);

  if (error) {
    console.log("Moderator unread count error:", error);
    return cachedUnreadCount || 0;
  }

  return count || 0;
}

async function refreshUnreadCount(moderatorId = cachedModeratorId) {
  try {
    let targetModeratorId = moderatorId;

    if (!targetModeratorId) {
      targetModeratorId = await getCurrentModeratorId();
    }

    if (!targetModeratorId) {
      setGlobalState({
        moderatorId: null,
        unreadCount: 0,
        loading: false,
      });

      return 0;
    }

    const nextCount = await fetchUnreadCount(targetModeratorId);

    setGlobalState({
      moderatorId: targetModeratorId,
      unreadCount: nextCount,
      loading: false,
    });

    return nextCount;
  } catch (error) {
    console.log("Refresh moderator unread count error:", error);

    setGlobalState({
      loading: false,
    });

    return cachedUnreadCount || 0;
  }
}

function scheduleUnreadRefresh(moderatorId) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  refreshTimer = setTimeout(() => {
    refreshUnreadCount(moderatorId);
  }, 180);
}

async function removeGlobalChannel() {
  if (globalChannel) {
    try {
      await supabase.removeChannel(globalChannel);
    } catch (error) {
      console.log("Remove moderator unread channel error:", error);
    }
  }

  globalChannel = null;
  globalChannelModeratorId = null;
}

async function setupGlobalModeratorUnreadChannel() {
  if (globalIsSettingUp) return;

  globalIsSettingUp = true;

  try {
    const moderatorId = await getCurrentModeratorId();

    if (!moderatorId) {
      await removeGlobalChannel();

      setGlobalState({
        moderatorId: null,
        unreadCount: 0,
        loading: false,
      });

      return;
    }

    setGlobalState({
      moderatorId,
      loading: false,
    });

    await refreshUnreadCount(moderatorId);

    if (globalChannel && globalChannelModeratorId === moderatorId) {
      return;
    }

    await removeGlobalChannel();

    const channelName = `moderator-unread-count-${moderatorId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "moderator_notifications",
          filter: `moderator_id=eq.${moderatorId}`,
        },
        () => {
          scheduleUnreadRefresh(moderatorId);
        }
      )
      .subscribe((status, error) => {
        console.log("Moderator unread badge realtime status:", status);

        if (error) {
          console.log("Moderator unread badge realtime error:", error);
        }
      });

    globalChannel = channel;
    globalChannelModeratorId = moderatorId;
  } catch (error) {
    console.log("Setup moderator unread channel error:", error);
  } finally {
    globalIsSettingUp = false;
  }
}

export default function useModeratorUnreadNotifications() {
  const mountedRef = useRef(true);

  const [state, setState] = useState({
    moderatorId: cachedModeratorId,
    unreadCount: cachedUnreadCount,
    loading: cachedLoading,
  });

  useEffect(() => {
    mountedRef.current = true;

    const listener = (nextState) => {
      if (!mountedRef.current) return;
      setState(nextState);
    };

    globalListeners.add(listener);

    setState({
      moderatorId: cachedModeratorId,
      unreadCount: cachedUnreadCount,
      loading: cachedLoading,
    });

    setupGlobalModeratorUnreadChannel();

    return () => {
      mountedRef.current = false;
      globalListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        setupGlobalModeratorUnreadChannel();
        refreshUnreadCount(cachedModeratorId);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const reloadUnreadNotificationCount = useCallback(async () => {
    return refreshUnreadCount(cachedModeratorId);
  }, []);

  const resetUnreadNotificationCount = useCallback(() => {
    setGlobalState({
      unreadCount: 0,
      loading: false,
    });
  }, []);

  return {
    moderatorId: state.moderatorId,
    unreadNotificationCount: state.unreadCount,
    loadingUnreadNotifications: state.loading,
    reloadUnreadNotificationCount,
    resetUnreadNotificationCount,
  };
}