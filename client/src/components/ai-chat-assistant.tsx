import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User, Bot, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

interface AIchatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  helpful?: boolean;
}

const quickQuestions = [
  "How do I check if my bank account is DBT-enabled?",
  "What documents are needed for scholarship application?",
  "My scholarship payment is delayed, what should I do?",
  "How to link Aadhaar with bank account?",
  "Which scholarships am I eligible for?",
  "How to track scholarship application status?"
];

export default function AIchatAssistant({ isOpen, onClose, language }: AIchatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: language === 'en' 
        ? "Hi! I'm your scholarship assistant. I can help you with Aadhaar seeding, DBT processes, and scholarship applications. How can I assist you today?"
        : "नमस्ते! मैं आपका छात्रवृत्ति सहायक हूं। मैं आधार सीडिंग, डीबीटी प्रक्रियाओं और छात्रवृत्ति आवेदनों में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation(language);
  const { toast } = useToast();

  const userId = "guest"; // In real app, get from auth context

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        userId
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: language === 'en' 
          ? "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
          : "मुझे खेद है, मुझे अभी जवाब देने में परेशानी हो रही है। कृपया एक क्षण में पुनः प्रयास करें।",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI assistant. Please check your connection.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: question,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(question);
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
    
    toast({
      title: helpful ? "Thank you!" : "Feedback received",
      description: helpful 
        ? "Your feedback helps us improve our assistance."
        : "We'll work on providing better responses.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0" data-testid="ai-chat-assistant">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            AI Scholarship Assistant
            <Badge variant="secondary" className="ml-2">Online</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!message.isUser && (
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
                    <Card className={`${message.isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {!message.isUser && message.id !== 'welcome' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-6 w-6 p-0 ${message.helpful === true ? 'text-green-600' : 'text-muted-foreground'}`}
                                onClick={() => handleFeedback(message.id, true)}
                                data-testid={`helpful-${message.id}`}
                              >
                                <ThumbsUp size={12} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-6 w-6 p-0 ${message.helpful === false ? 'text-red-600' : 'text-muted-foreground'}`}
                                onClick={() => handleFeedback(message.id, false)}
                                data-testid={`not-helpful-${message.id}`}
                              >
                                <ThumbsDown size={12} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {message.isUser && (
                    <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <Card className="bg-muted">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm text-muted-foreground">AI is typing...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Quick questions:</h4>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-2 text-xs"
                    onClick={() => handleQuickQuestion(question)}
                    data-testid={`quick-question-${index}`}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-6 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? "Type your question..." : "अपना सवाल लिखें..."}
                disabled={chatMutation.isPending}
                className="flex-1"
                data-testid="chat-input"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                className="px-3"
                data-testid="send-message-button"
              >
                {chatMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              AI responses are generated and may not always be accurate. Please verify important information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
