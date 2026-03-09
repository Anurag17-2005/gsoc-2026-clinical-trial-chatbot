import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ChatMessage, Trial, UserProfile } from "@/data/types";
import { trials } from "@/data/trials";

interface AssistantContextType {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  mapTrials: Trial[];
  setMapTrials: (trials: Trial[]) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const defaultUserProfile: UserProfile = {
  id: "user123",
  name: "User",
  age: 45,
  location: "Toronto",
  city: "Toronto",
  province: "Ontario",
  latitude: 43.6629,
  longitude: -79.3957,
  cancer_type: "Lung",
  disease_stage: "Stage III",
  biomarkers: [],
  medical_history: "",
};

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello ${defaultUserProfile.name}! I'm your AI Trial Assistant. Based on your profile (${defaultUserProfile.cancer_type}, ${defaultUserProfile.disease_stage}), I can find the best clinical trials for you. Ask me to find your nearest trials or best matching trials!`,
    },
  ]);
  const [mapTrials, setMapTrials] = useState<Trial[]>(trials);

  // Update welcome message when profile changes
  useEffect(() => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated[0]?.id === "welcome") {
        updated[0] = {
          ...updated[0],
          content: `Hello ${userProfile.name}! I'm your AI Trial Assistant. Based on your profile (${userProfile.cancer_type}, ${userProfile.disease_stage}), I can find the best clinical trials for you. Ask me to find your nearest trials or best matching trials!`,
        };
      }
      return updated;
    });
  }, [userProfile]);

  return (
    <AssistantContext.Provider
      value={{
        messages,
        setMessages,
        mapTrials,
        setMapTrials,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }
  return context;
};
