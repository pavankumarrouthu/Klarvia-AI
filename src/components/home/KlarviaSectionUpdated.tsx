import { useState, useRef, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import klarviaAvatar from "@/assets/klarvia-avatar-new.jpg";

const KlarviaSectionUpdated = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [klarviaResponse, setKlarviaResponse] = useState("");
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isKlarviaSpeaking, setIsKlarviaSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Array<{speaker: 'user' | 'klarvia', text: string}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

  const startConversation = async () => {
    if (!user) {
      alert('Please log in to start a conversation with Klarvia');
      return;
    }

    try {
      // Initialize Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in your browser');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsActive(true);
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          setIsUserSpeaking(true);
        }

        if (finalTranscript) {
          setIsUserSpeaking(false);
          const userMessage = finalTranscript.trim();
          setUserInput(userMessage);
          
          // Add to conversation
          setConversation(prev => [...prev, { speaker: 'user', text: userMessage }]);
          
          // Generate Klarvia response
          setTimeout(() => {
            const responses = [
              `I understand you said: "${userMessage}". How can I help you with that?`,
              `Thank you for sharing. "${userMessage}" - Let me assist you with this.`,
              `I hear you. "${userMessage}" - I'm here to support you.`,
              `Got it! "${userMessage}" - Tell me more about that.`
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setKlarviaResponse(randomResponse);
            setConversation(prev => [...prev, { speaker: 'klarvia', text: randomResponse }]);
            speakResponse(randomResponse);
          }, 800);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsUserSpeaking(false);
      };

      recognitionRef.current.onend = () => {
        if (isActive) {
          recognitionRef.current?.start();
        }
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start speech recognition. Please check microphone permissions.');
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsKlarviaSpeaking(true);
      utterance.onend = () => setIsKlarviaSpeaking(false);
      utterance.onerror = () => setIsKlarviaSpeaking(false);
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopConversation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsActive(false);
    setUserInput("");
    setKlarviaResponse("");
    setIsUserSpeaking(false);
    setIsKlarviaSpeaking(false);
  };

  // If user speaks while Klarvia is talking, stop Klarvia
  useEffect(() => {
    if (isUserSpeaking && isKlarviaSpeaking) {
      window.speechSynthesis.cancel();
      setIsKlarviaSpeaking(false);
    }
  }, [isUserSpeaking, isKlarviaSpeaking]);

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
            Meet Klarvia
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Have a natural voice conversation with Klarvia, your AI companion for workplace wellbeing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Klarvia Card */}
          <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border border-primary/20 hover:border-primary/40 transition-all shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-teal via-primary to-accent p-1 ${isKlarviaSpeaking ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <img src={klarviaAvatar} alt="Klarvia AI" className="w-full h-full object-cover" />
                  </div>
                </div>
                {isKlarviaSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-teal/60 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Klarvia</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isKlarviaSpeaking ? 'bg-teal animate-pulse' : 'bg-muted'}`} />
                  <p className="text-xs text-muted-foreground">
                    {isKlarviaSpeaking ? "Speaking..." : "Listening"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* User Card */}
          <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border border-muted hover:border-muted-foreground/40 transition-all shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-muted to-secondary p-1 ${isUserSpeaking ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-4xl">
                      👤
                    </div>
                  </div>
                </div>
                {isUserSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-primary/60 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-teal/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">You</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isUserSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <p className="text-xs text-muted-foreground">
                    {isUserSpeaking ? "Speaking..." : "Ready"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conversation Area */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 min-h-[150px] max-h-[300px] overflow-y-auto shadow-inner">
          {conversation.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground italic">
              {isActive 
                ? "Listening... Start speaking to Klarvia"
                : "Click Start to begin your conversation with Klarvia"}
            </p>
          ) : (
            <div className="space-y-3">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.speaker === 'user' 
                      ? 'bg-primary/10 text-foreground' 
                      : 'bg-teal/10 text-foreground'
                  }`}>
                    <p className="text-xs font-semibold mb-1">
                      {msg.speaker === 'user' ? 'You' : 'Klarvia'}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <Button
              size="lg"
              onClick={startConversation}
              disabled={!user}
              className="bg-gradient-to-r from-teal to-primary hover:from-teal/90 hover:to-primary/90 text-primary-foreground transition-smooth px-10 py-5 text-sm shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Mic className="mr-2 h-4 w-4" />
              {user ? 'Start Conversation' : 'Login to Start'}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={stopConversation}
              className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-destructive-foreground transition-smooth px-10 py-5 text-sm shadow-lg"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default KlarviaSectionUpdated;
