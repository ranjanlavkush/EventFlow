import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

const formSchema = z.object({
  educationLevel: z.enum(["pre-matric", "post-matric"]),
  casteCategory: z.enum(["general", "obc", "sc", "st"]),
  incomeLevel: z.enum(["below-1-lakh", "1-2-lakh", "2-5-lakh", "above-5-lakh"]),
  state: z.string().min(1)
});

interface EligibilityWizardProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ScholarshipResult {
  name: string;
  amount: string;
  deadline: string;
  eligible: boolean;
}

export default function EligibilityWizard({ isOpen, onClose, language }: EligibilityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<ScholarshipResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const t = useTranslation(language);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationLevel: "pre-matric",
      casteCategory: "general",
      incomeLevel: "below-1-lakh",
      state: ""
    }
  });

  const eligibilityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/check-eligibility', data);
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.scholarships || []);
      setShowResults(true);
      toast({
        title: "Eligibility Check Complete",
        description: `Found ${data.scholarships?.length || 0} eligible scholarships`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    eligibilityMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setShowResults(false);
    setResults([]);
    form.reset();
  };

  const steps = [
    { number: 1, title: "Education Level" },
    { number: 2, title: "Category" },
    { number: 3, title: "Income" },
    { number: 4, title: "Location" }
  ];

  if (showResults) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="eligibility-results">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="text-secondary" />
              Eligibility Results
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((scholarship, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold text-lg mb-2">{scholarship.name}</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-medium text-accent">{scholarship.amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className="font-medium">{scholarship.deadline}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your selection or check back later for new opportunities.
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={resetWizard} variant="outline" data-testid="restart-wizard">
                Check Again
              </Button>
              <Button onClick={onClose} data-testid="close-results">
                {t('close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="eligibility-wizard">
        <DialogHeader>
          <DialogTitle>Smart Eligibility Wizard</DialogTitle>
        </DialogHeader>
        
        {/* Progress Indicator */}
        <div className="space-y-4 mb-6">
          <Progress value={(currentStep / 4) * 100} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    currentStep >= step.number 
                      ? 'progress-step active' 
                      : 'border-border bg-background'
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Education Level */}
            {currentStep === 1 && (
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem data-testid="education-level-step">
                    <FormLabel className="text-xl font-semibold">What's your current education level?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                          <RadioGroupItem value="pre-matric" id="pre-matric" className="mr-3" />
                          <div>
                            <label htmlFor="pre-matric" className="font-medium cursor-pointer">Pre-Matric</label>
                            <div className="text-sm text-muted-foreground">Classes 1-10</div>
                          </div>
                        </div>
                        <div className="flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                          <RadioGroupItem value="post-matric" id="post-matric" className="mr-3" />
                          <div>
                            <label htmlFor="post-matric" className="font-medium cursor-pointer">Post-Matric</label>
                            <div className="text-sm text-muted-foreground">Class 11+</div>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Step 2: Caste Category */}
            {currentStep === 2 && (
              <FormField
                control={form.control}
                name="casteCategory"
                render={({ field }) => (
                  <FormItem data-testid="caste-category-step">
                    <FormLabel className="text-xl font-semibold">Select your category</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {[
                          { value: "general", label: "General" },
                          { value: "obc", label: "OBC (Other Backward Class)" },
                          { value: "sc", label: "SC (Scheduled Caste)" },
                          { value: "st", label: "ST (Scheduled Tribe)" }
                        ].map((option) => (
                          <div key={option.value} className="flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                            <RadioGroupItem value={option.value} id={option.value} className="mr-3" />
                            <label htmlFor={option.value} className="font-medium cursor-pointer">{option.label}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Step 3: Income Level */}
            {currentStep === 3 && (
              <FormField
                control={form.control}
                name="incomeLevel"
                render={({ field }) => (
                  <FormItem data-testid="income-level-step">
                    <FormLabel className="text-xl font-semibold">What's your family's annual income?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {[
                          { value: "below-1-lakh", label: "Below ₹1 Lakh" },
                          { value: "1-2-lakh", label: "₹1-2 Lakh" },
                          { value: "2-5-lakh", label: "₹2-5 Lakh" },
                          { value: "above-5-lakh", label: "Above ₹5 Lakh" }
                        ].map((option) => (
                          <div key={option.value} className="flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                            <RadioGroupItem value={option.value} id={option.value} className="mr-3" />
                            <label htmlFor={option.value} className="font-medium cursor-pointer">{option.label}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Step 4: State */}
            {currentStep === 4 && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem data-testid="state-step">
                    <FormLabel className="text-xl font-semibold">Select your state</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {[
                          "Bihar", "Jharkhand", "West Bengal", "Uttar Pradesh", 
                          "Odisha", "Assam", "Other"
                        ].map((state) => (
                          <div key={state} className="flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                            <RadioGroupItem value={state.toLowerCase()} id={state} className="mr-3" />
                            <label htmlFor={state} className="font-medium cursor-pointer">{state}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="wizard-prev-button"
              >
                <ArrowLeft className="mr-2" size={16} />
                {t('previousStep')}
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  data-testid="wizard-next-button"
                >
                  {t('nextStep')}
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={eligibilityMutation.isPending}
                  data-testid="wizard-submit-button"
                >
                  {eligibilityMutation.isPending ? "Checking..." : "Check Eligibility"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
