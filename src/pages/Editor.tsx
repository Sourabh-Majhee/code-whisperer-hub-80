import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  RotateCcw, 
  Save, 
  Download, 
  HelpCircle, 
  Eye, 
  Settings,
  Brain,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";

const sampleCode = `def fibonacci(n):
    """Calculate the nth Fibonacci number using recursion."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`;

const codeExplanations = [
  { 
    line: 1, 
    short: "Function definition with parameter n", 
    detailed: "Defines a function named 'fibonacci' that takes one parameter 'n' representing the position in the Fibonacci sequence.",
    confidence: 95,
    verified: true
  },
  { 
    line: 2, 
    short: "Docstring explaining the function", 
    detailed: "A documentation string that describes what the function does - calculating the nth Fibonacci number using recursion.",
    confidence: 100,
    verified: true
  },
  { 
    line: 3, 
    short: "Base case for recursion", 
    detailed: "Checks if n is 0 or 1. These are the base cases that stop the recursion, as F(0)=0 and F(1)=1.",
    confidence: 98,
    verified: true
  },
  { 
    line: 4, 
    short: "Return base case value", 
    detailed: "Returns n directly for the base cases (0 or 1), preventing infinite recursion.",
    confidence: 100,
    verified: true
  },
  { 
    line: 5, 
    short: "Recursive call for Fibonacci", 
    detailed: "Implements the Fibonacci formula: F(n) = F(n-1) + F(n-2). Calls itself twice with smaller values.",
    confidence: 92,
    verified: true
  },
];

export default function Editor() {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [code, setCode] = useState(sampleCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34`);
      setIsRunning(false);
    }, 1500);
  };

  const getLineExplanation = (lineNum: number) => {
    return codeExplanations.find(exp => exp.line === lineNum);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI Code Editor</h1>
            <p className="text-muted-foreground">Write, run, and understand code with AI explanations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card className="code-editor">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Code Editor</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">Python</Badge>
                <Button 
                  onClick={runCode} 
                  disabled={isRunning}
                  variant="success"
                  size="sm"
                >
                  {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute left-0 top-0 w-12 bg-editor-line border-r border-editor-border">
                  {code.split('\n').map((_, index) => (
                    <div 
                      key={index + 1}
                      className="h-6 flex items-center justify-center text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedLine(index + 1)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-transparent text-sm font-mono resize-none outline-none pl-14 p-4 min-h-96"
                  placeholder="Start typing your code..."
                  style={{ lineHeight: '1.5rem' }}
                />
                {/* Explain buttons on hover */}
                <div className="absolute right-2 top-2">
                  <Button variant="glass" size="sm" className="opacity-75 hover:opacity-100">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Explain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explanation & Output Panel */}
          <div className="space-y-6">
            {/* AI Explanation */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span>AI Explanation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLine ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Line {selectedLine}</Badge>
                      <div className="flex items-center space-x-2">
                        {getLineExplanation(selectedLine)?.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Target className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getLineExplanation(selectedLine)?.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="simple" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="simple">Simple</TabsTrigger>
                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                      </TabsList>
                      <TabsContent value="simple" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          {getLineExplanation(selectedLine)?.short || "Click on a line number to see explanation"}
                        </p>
                      </TabsContent>
                      <TabsContent value="detailed" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          {getLineExplanation(selectedLine)?.detailed || "Click on a line number to see detailed explanation"}
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Click on any line number to get AI explanation</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span>Output</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-editor-bg rounded-lg p-4 min-h-32">
                  {output ? (
                    <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                      {output}
                    </pre>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Run your code to see output</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="glass">
            <HelpCircle className="w-4 h-4 mr-2" />
            Explain Entire Code
          </Button>
          <Button variant="glass">
            <Target className="w-4 h-4 mr-2" />
            Generate Practice Questions
          </Button>
          <Button variant="glass">
            <Brain className="w-4 h-4 mr-2" />
            Suggest Optimizations
          </Button>
        </div>
      </div>
    </div>
  );
}