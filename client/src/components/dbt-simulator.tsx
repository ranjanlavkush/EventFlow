import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { type Language } from "@/lib/i18n";

interface DBTSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface SimulationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'warning';
}

export default function DBTSimulator({ isOpen, onClose, language }: DBTSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);

  const startSimulation = () => {
    if (!aadhaarNumber || !accountNumber) return;

    const steps: SimulationStep[] = [
      {
        id: 1,
        title: "Connecting to UIDAI Database",
        description: "Verifying Aadhaar number authenticity",
        status: 'pending'
      },
      {
        id: 2,
        title: "Bank Account Verification",
        description: "Checking account details and KYC status",
        status: 'pending'
      },
      {
        id: 3,
        title: "Aadhaar-Account Linkage Check",
        description: "Verifying if Aadhaar is linked to bank account",
        status: 'pending'
      },
      {
        id: 4,
        title: "DBT Enablement Status",
        description: "Checking if account is DBT-enabled for transfers",
        status: 'pending'
      },
      {
        id: 5,
        title: "Final Verification",
        description: "Confirming eligibility for scholarship transfers",
        status: 'pending'
      }
    ];

    setSimulationSteps(steps);
    setIsSimulationStarted(true);
    setCurrentStep(0);

    // Simulate step-by-step verification
    simulateSteps(steps);
  };

  const simulateSteps = (steps: SimulationStep[]) => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        setSimulationSteps(prevSteps => 
          prevSteps.map(s => 
            s.id === step.id 
              ? { ...s, status: getStepStatus(index) }
              : s
          )
        );
      }, (index + 1) * 2000);
    });
  };

  const getStepStatus = (index: number): 'success' | 'error' | 'warning' => {
    // Simulate different scenarios
    if (aadhaarNumber.includes('1234')) {
      if (index === 2) return 'error'; // Account not linked
      if (index === 3) return 'warning'; // Partial linkage
    }
    return 'success';
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin" />;
    }
  };

  const resetSimulation = () => {
    setIsSimulationStarted(false);
    setCurrentStep(0);
    setSimulationSteps([]);
    setAadhaarNumber("");
    setAccountNumber("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dbt-simulator">
        <DialogHeader>
          <DialogTitle>DBT Seeding Status Simulator</DialogTitle>
        </DialogHeader>

        {!isSimulationStarted ? (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">How this simulator works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enter your Aadhaar and bank account details</li>
                <li>• Experience a realistic verification process</li>
                <li>• Understand each step of DBT seeding</li>
                <li>• Learn what to expect on real portals</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  data-testid="aadhaar-input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use 1234 in number for demo error scenario
                </p>
              </div>
              
              <div>
                <Label htmlFor="account">Bank Account Number</Label>
                <Input
                  id="account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  data-testid="account-input"
                />
              </div>
            </div>

            <Button 
              onClick={startSimulation}
              disabled={!aadhaarNumber || !accountNumber}
              className="w-full"
              data-testid="start-simulation-button"
            >
              Start DBT Status Check
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-semibold">Simulation in Progress</h3>
              <p className="text-sm text-muted-foreground">
                This is how the verification process works on actual government portals
              </p>
            </div>

            <div className="space-y-3">
              {simulationSteps.map((step, index) => (
                <Card key={step.id} className={currentStep >= step.id ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Step {step.id}: {step.title}</span>
                      {getStatusIcon(step.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.status === 'error' && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        ❌ Error: Aadhaar not linked to this account. Please visit your bank branch.
                      </div>
                    )}
                    
                    {step.status === 'warning' && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                        ⚠️ Warning: Partial linkage detected. Additional verification may be required.
                      </div>
                    )}
                    
                    {step.status === 'success' && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        ✅ Success: Verification completed successfully.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {currentStep >= simulationSteps.length && (
              <div className="mt-6 space-y-4">
                <Card className="bg-secondary/10">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Simulation Complete!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've experienced the DBT verification process. In real scenarios, 
                      results may vary based on your actual account status.
                    </p>
                    
                    <div className="flex gap-2">
                      <Button onClick={resetSimulation} variant="outline" size="sm" data-testid="try-again-button">
                        Try Different Details
                      </Button>
                      <Button onClick={onClose} size="sm" data-testid="close-simulator-button">
                        Close Simulator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
