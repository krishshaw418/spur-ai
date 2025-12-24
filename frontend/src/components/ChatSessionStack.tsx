import { useSidebarStore, useSessionStore } from "../store";
import { Button } from "./ui/button";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { getPreviousConversation, useChatStore, useSessionIdStore } from "../store";
import type { Message } from "@/types";

function ChatSessionStack() {
  const open = useSidebarStore((state) => state.open);
  const Id = useSessionStore((state) => state.Id);
  const setId = useSessionStore((state) => state.setId);
  const userId = Id?.slice(0, Id.indexOf(':'));
  const sessionIds = useSessionIdStore().sessionIds;
  const setSessionIds = useSessionIdStore().setSessionIds;
  

  useEffect(() => {
    const fetchSessionIds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/chat/${userId}`, {
          withCredentials: true
        });
        const data = response.data;
        if (data) {
          setSessionIds(data.sessionIds);
        }
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          return;
        }
        if (error instanceof TypeError) {
          toast.error(error.message);
          return;
        }
        console.log(error);
        return;
      }
    }
    fetchSessionIds();
  }, [Id, userId, setSessionIds]); // Fixed: Added missing dependencies


  return (
    <div className={`border-r transition-full duration-300 ${open ? 'w-64' : 'w-0'} h-screen`}>
        {open && (<div className="flex flex-col items-center h-full">
            <span className="font-bold text-lg border-b w-full text-center py-6">
                Chat History
            </span>
            <div className="overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col overflow-auto scrollbar-invisible">
                  {sessionIds.length !== 0 ? sessionIds.map((sessionId) => {
                    return (
                      <Button onClick={async () => {
                        const userId = Id?.slice(0, Id.indexOf(':'));
                        const conversationId = sessionId.id;

                        if (userId && conversationId) {
                          localStorage.setItem('userId', `${userId}:${conversationId}`);
                          setId(`${userId}:${conversationId}`);
                          const msgs: Message[] = await getPreviousConversation(userId, conversationId);
                          if (msgs && Array.isArray(msgs)) {
                            const addMessage = useChatStore.getState().addMessage;
                            const clearMessages = useChatStore.getState().clearMessages;
                            clearMessages();
                            if (msgs.length === 0) return;
                            msgs.forEach((msg) => {
                              const oldSessionMessage: Message = {
                              message: msg.message,
                              role: msg.role,
                              timestamp: new Date(msg.timestamp), // Convert string to Date
                            };
                            addMessage(oldSessionMessage);
                            });
                          }
                        }
                      }} key={sessionId.id} type="button" variant={"ghost"} className="border-b rounded-0">
                        Session {sessionId.id.slice(0, 6)}
                      </Button>
                    )
                  }) : (<div className={`text-lg px-8 py-5 text-center ${open ? "" : "hidden"}`}>
                    No History to show yet.
                  </div>)}
                </div>
            </div>
        </div>)}
    </div>
  )
}

export default ChatSessionStack