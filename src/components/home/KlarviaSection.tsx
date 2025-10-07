import { useState, useRef, useEffect } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import klarviaAvatar from "@/assets/klarvia-avatar.jpg";

const KlarviaSection = () => {
  const [isActive, setIsActive] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [klarviaTranscript, setKlarviaTranscript] = useState("");
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isKlarviaSpeaking, setIsKlarviaSpeaking] = useState(false);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    analyserRef.current = null;
  };

  const detectAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const isSpeaking = average > 10;
    
    setIsUserSpeaking(isSpeaking);
    
    animationFrameRef.current = requestAnimationFrame(detectAudioLevel);
  };

  const startConversation = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsActive(true);
      detectAudioLevel();

      // Simulate speech recognition and response
      setTimeout(() => {
        setIsUserSpeaking(false);
        const mockUserInput = "I'm feeling stressed about work";
        setUserTranscript(mockUserInput);
        
        // Klarvia responds
        setTimeout(() => {
          setIsKlarviaSpeaking(true);
          setKlarviaTranscript(`${mockUserInput}. I'm Klarvia, I'm here to help you.`);
          
          setTimeout(() => {
            setIsKlarviaSpeaking(false);
          }, 4000);
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopConversation = () => {
    stopAllMedia();
    setIsActive(false);
    setUserTranscript("");
    setKlarviaTranscript("");
    setIsUserSpeaking(false);
    setIsKlarviaSpeaking(false);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
            Meet Klarvia
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a natural voice conversation with Klarvia, your AI companion for workplace wellbeing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Klarvia Card */}
          <Card className="p-8 bg-gradient-to-br from-card to-muted/20 border border-primary/20 hover:border-primary/40 transition-all shadow-lg hover:shadow-xl">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-teal via-primary to-accent p-1 ${isKlarviaSpeaking ? 'animate-pulse' : ''}`}>
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
                <h3 className="text-xl font-semibold mb-2">Klarvia</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${isKlarviaSpeaking ? 'bg-teal animate-pulse' : 'bg-muted'}`} />
                  <p className="text-sm text-muted-foreground">
                    {isKlarviaSpeaking ? "Speaking..." : "Listening"}
                  </p>
                </div>
                {klarviaTranscript && (
                  <div className="min-h-[80px] p-4 bg-muted/30 rounded-lg text-sm text-foreground">
                    {klarviaTranscript}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* User Card */}
          <Card className="p-8 bg-gradient-to-br from-card to-secondary/20 border border-muted hover:border-muted-foreground/40 transition-all shadow-lg hover:shadow-xl">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-muted to-secondary p-1 ${isUserSpeaking ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl">
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
                <h3 className="text-xl font-semibold mb-2">You</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${isUserSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <p className="text-sm text-muted-foreground">
                    {isUserSpeaking ? "Speaking..." : "Ready"}
                  </p>
                </div>
                {userTranscript && (
                  <div className="min-h-[80px] p-4 bg-muted/30 rounded-lg text-sm text-foreground">
                    {userTranscript}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <Button
              size="lg"
              onClick={startConversation}
              className="bg-gradient-to-r from-teal to-primary hover:from-teal/90 hover:to-primary/90 text-primary-foreground transition-smooth px-12 py-6 shadow-lg hover:shadow-xl"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Conversation
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={stopConversation}
              className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-destructive-foreground transition-smooth px-12 py-6 shadow-lg"
            >
              <Square className="mr-2 h-5 w-5" />
              Stop Conversation
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default KlarviaSection;
