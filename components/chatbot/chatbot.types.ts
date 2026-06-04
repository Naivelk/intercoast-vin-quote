export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageType = 'text' | 'suggestion' | 'form' | 'quote';

export interface MessageOptions {
  type?: MessageType;
  options?: readonly string[];
  formData?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  metadata?: MessageOptions;
}

export type BotResponse = string | { 
  content: string; 
  type: MessageType; 
  options?: readonly string[] 
};

export interface ChatbotContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  userData: UserData;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  startNewConversation: () => void;
  sendFormData: (data: Record<string, any>) => void;
  announce?: (content: string, options?: MessageOptions) => Promise<void>;
}

export type InsuranceType = 'auto' | 'home' | 'motorcycle' | 'boat' | 'other';

export interface Vehicle {
  vin?: string;
  year?: string;
  make?: string;
  model?: string;
  bodyClass?: string;
  fuelType?: string;
  engineHP?: string;
  driveType?: string;
  licensePlate?: string;
  value?: string;
  // Extended fields from VIN decoding (optional)
  vehicleType?: string;
  engineCylinders?: string;
  displacementL?: string;
  transmissionStyle?: string;
  transmissionSpeeds?: string;
  doors?: string;
  seats?: string;
  gvwr?: string;
  series?: string;
  trim?: string;
  plantCountry?: string;
  plantCity?: string;
}

export interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  documentNumber?: string;
  insuranceType?: InsuranceType;
  currentVehicleIndex?: number;
  vehicles?: Vehicle[];
  currentStep?: string;
  quoteAmount?: number;
}

export interface ChatbotConfig {
  welcomeMessage: string;
  initialSuggestions: string[];
  maxMessageLength: number;
  maxVehicles: number;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    botBubbleColor: string;
    userBubbleColor: string;
    botTextColor: string;
    userTextColor: string;
  };
}
