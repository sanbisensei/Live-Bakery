// Observer Pattern — Behavioural
// The orders table is the subject.
// This hook is the observer — it subscribes to changes
// and notifies the UI automatically when order status changes.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useOrderStatus(orderId: string, initialStatus: string) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    // Observer registers itself — subscribes to this specific order
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload: { new: { status: string } }) => {
          // Observer gets notified — update UI instantly
          setStatus(payload.new.status);
        },
      )
      .subscribe();

    // Unsubscribe when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return status;
}
