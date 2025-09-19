import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, CheckCircle, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

interface GamifiedLearningProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the difference between Aadhaar-linked and DBT-enabled bank accounts?",
    options: [
      "There is no difference, they are the same",
      "Aadhaar-linked means Aadhaar is connected to account, DBT-enabled means it can receive government transfers",
      "DBT-enabled accounts are only for rich people",
      "Aadhaar-linked accounts cannot receive money"
    ],
    correctAnswer: 1,
    explanation: "Aadhaar-linked means your Aadhaar is connected to your bank account. DBT-enabled means the account is specifically configured to receive Direct Benefit Transfers from the government."
  },
  {
    id: 2,
    question: "What should you do if your scholarship money is delayed?",
    options: [
      "Wait forever without doing anything",
      "Check DBT seeding status and contact bank if needed",
      "Apply for another scholarship immediately",
      "Complain on social media only"
    ],
    correctAnswer: 1,
    explanation: "First check your DBT seeding status. If properly seeded, contact your bank to verify account details. You can also track status on government portals."
  },
  {
    id: 3,
    question: "Which document is most important for scholarship applications?",
    options: [
      "Voter ID only",
      "Aadhaar card and bank account details",
      "Driving license",
      "Birth certificate only"
    ],
    correctAnswer: 1,
    explanation: "Aadhaar card and bank account details are essential for most scholarships as they enable DBT transfers and identity verification."
  },
  {
    id: 4,
    question: "How often should you check your scholarship application status?",
    options: [
      "Never check, it will come automatically",
      "Once every few weeks during processing period",
      "Every hour",
      "Only after one year"
    ],
    correctAnswer: 1,
    explanation: "Regular checking (every few weeks) helps you stay informed about your application status and take action if needed."
  },
  {
    id: 5,
    question: "What is the best way to ensure you don't miss scholarship deadlines?",
    options: [
      "Remember everything in your head",
      "Set calendar reminders and subscribe to notifications",
      "Ask friends to remind you",
      "Check once a year"
    ],
    correctAnswer: 1,
    explanation: "Setting calendar reminders and subscribing to official notifications (like WhatsApp updates) ensures you never miss important deadlines."
  }
];

export default function GamifiedLearning({ isOpen, onClose, language }: GamifiedLearningProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const t = useTranslation(language);
  const { toast } = useToast();

  const userId = "guest"; // In real app, get from auth context

  const { data: gamificationData } = useQuery({
    queryKey: ['/api/gamification', userId],
    enabled: isOpen
  });

  const scoreMutation = useMutation({
    mutationFn: async (data: { userId: string; score: number; quizType: string }) => {
      const response = await apiRequest('POST', '/api/quiz-score', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Progress Saved!",
        description: `Earned ${data.progress?.totalPoints || 0} total points`,
      });
    }
  });

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 20);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
      // Save score to backend
      scoreMutation.mutate({
        userId,
        score,
        quizType: "aadhaar_basics"
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / (quizQuestions.length * 20)) * 100;
    if (percentage >= 80) return "Excellent! You're an Aadhaar expert! 🏆";
    if (percentage >= 60) return "Good job! You understand the basics well! 👍";
    if (percentage >= 40) return "Not bad! Review the concepts and try again! 📚";
    return "Keep learning! Practice makes perfect! 💪";
  };

  const getBadgeLevel = () => {
    const percentage = (score / (quizQuestions.length * 20)) * 100;
    if (percentage >= 80) return "Expert";
    if (percentage >= 60) return "Proficient";
    if (percentage >= 40) return "Learner";
    return "Beginner";
  };

  if (isQuizComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl" data-testid="quiz-complete">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Quiz Complete!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-6">
            <div className="bg-primary/10 rounded-lg p-6">
              <div className="text-4xl font-bold text-primary mb-2">{score}/100</div>
              <p className="text-lg">{getScoreMessage()}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Star className="mx-auto mb-2 text-yellow-500" size={32} />
                  <div className="font-semibold">Your Badge</div>
                  <Badge variant="secondary" className="mt-2">
                    {getBadgeLevel()}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                  <div className="font-semibold">Correct Answers</div>
                  <div className="text-2xl font-bold">{score / 20}/5</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Trophy className="mx-auto mb-2 text-accent" size={32} />
                  <div className="font-semibold">Total Points</div>
                  <div className="text-2xl font-bold">{(gamificationData as any)?.totalPoints || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline" data-testid="retry-quiz-button">
                Try Again
              </Button>
              <Button onClick={onClose} data-testid="close-quiz-button">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="gamified-learning">
        <DialogHeader>
          <DialogTitle>Scholarship Knowledge Quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>Score: {score}/100</span>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} />
          </div>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {quizQuestions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 ${
                    selectedAnswer === index
                      ? index === quizQuestions[currentQuestion].correctAnswer
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-red-100 border-red-500 text-red-700"
                      : isAnswered && index === quizQuestions[currentQuestion].correctAnswer
                      ? "bg-green-100 border-green-500 text-green-700"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  data-testid={`answer-option-${index}`}
                >
                  <div className="flex items-center gap-2">
                    {isAnswered && (
                      selectedAnswer === index ? (
                        index === quizQuestions[currentQuestion].correctAnswer ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-red-600" />
                        )
                      ) : index === quizQuestions[currentQuestion].correctAnswer ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : null
                    )}
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Explanation */}
          {showExplanation && (
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm">{quizQuestions[currentQuestion].explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {isAnswered ? (
                selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? (
                  <span className="text-green-600">✅ Correct! +20 points</span>
                ) : (
                  <span className="text-red-600">❌ Incorrect! +0 points</span>
                )
              ) : (
                "Select an answer to continue"
              )}
            </div>
            
            <Button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              data-testid="next-question-button"
            >
              {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
