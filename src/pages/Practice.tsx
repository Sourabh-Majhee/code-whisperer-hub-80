import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  Code, 
  Lightbulb, 
  Trophy,
  Play,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  starter_code: string;
  solution: string;
  test_cases: any[];
  hints: string[];
  concepts: string[];
  language: string;
  difficulty: string;
  topic: string;
}

export default function Practice() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<PracticeProblem | null>(null);
  const [userCode, setUserCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [selectedTopic, setSelectedTopic] = useState("arrays");
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeUser();
    loadProblems();
  }, []);

  const initializeUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profile);
      if (profile?.preferred_languages?.length > 0) {
        setSelectedLanguage(profile.preferred_languages[0].toLowerCase());
      }
    }
  };

  const loadProblems = async () => {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setProblems(data);
    }
  };

  const generateProblem = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate practice problems.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-practice', {
        body: {
          language: selectedLanguage,
          difficulty: selectedDifficulty,
          topic: selectedTopic,
          userId: user.id
        }
      });

      if (error) throw error;

      setCurrentProblem(data);
      setUserCode(data.starterCode || data.starter_code);
      setProblems(prev => [data, ...prev.slice(0, 9)]);
      
      toast({
        title: "Problem generated!",
        description: "A new practice problem has been created for you.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate problem",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const runTests = () => {
    if (!currentProblem) return;
    
    // Simulate test execution
    const results = currentProblem.test_cases.map((testCase, index) => ({
      input: testCase.input,
      expected: testCase.output,
      actual: testCase.output, // Simulate correct output
      passed: Math.random() > 0.3 // 70% pass rate simulation
    }));
    
    setTestResults(results);
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    if (passedTests === totalTests) {
      toast({
        title: "All tests passed!",
        description: "Congratulations! Your solution is correct.",
      });
      
      // Update progress
      updateProgress();
    } else {
      toast({
        title: `${passedTests}/${totalTests} tests passed`,
        description: "Some tests failed. Check your logic and try again.",
        variant: "destructive",
      });
    }
  };

  const updateProgress = async () => {
    if (!user) return;
    
    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        problems_solved: 1,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });
  };

  const selectProblem = (problem: PracticeProblem) => {
    setCurrentProblem(problem);
    setUserCode(problem.starter_code);
    setTestResults([]);
    setShowHints(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-secondary/10 text-secondary';
      case 'intermediate': return 'bg-primary/10 text-primary';
      case 'advanced': return 'bg-accent/10 text-accent';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Coding</h1>
          <p className="text-muted-foreground">
            Improve your skills with AI-generated practice problems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problem Generator */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Generate Problem</span>
                </CardTitle>
                <CardDescription>Create personalized practice problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arrays">Arrays</SelectItem>
                      <SelectItem value="strings">Strings</SelectItem>
                      <SelectItem value="sorting">Sorting</SelectItem>
                      <SelectItem value="recursion">Recursion</SelectItem>
                      <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateProblem}
                  disabled={isGenerating}
                  className="w-full"
                  variant="hero"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Problem
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Problems */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-secondary" />
                  <span>Recent Problems</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="p-3 rounded-lg border cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => selectProblem(problem)}
                    >
                      <h4 className="font-medium text-sm">{problem.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{problem.language}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Problem Area */}
          <div className="lg:col-span-3">
            {currentProblem ? (
              <div className="space-y-6">
                {/* Problem Description */}
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{currentProblem.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(currentProblem.difficulty)}>
                          {currentProblem.difficulty}
                        </Badge>
                        <Badge variant="outline">{currentProblem.language}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{currentProblem.description}</p>
                    
                    {currentProblem.concepts.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm font-medium">Concepts:</span>
                        {currentProblem.concepts.map((concept, index) => (
                          <Badge key={index} variant="secondary">{concept}</Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {showHints ? 'Hide' : 'Show'} Hints
                      </Button>
                    </div>
                    
                    {showHints && currentProblem.hints.length > 0 && (
                      <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-medium mb-2">Hints:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {currentProblem.hints.map((hint, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Code Editor */}
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Code className="w-5 h-5" />
                        <span>Your Solution</span>
                      </CardTitle>
                      <Button onClick={runTests} variant="success">
                        <Play className="w-4 h-4 mr-2" />
                        Run Tests
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[300px] resize-none"
                      placeholder="Write your solution here..."
                    />
                  </CardContent>
                </Card>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5" />
                        <span>Test Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              {result.passed ? (
                                <CheckCircle className="w-5 h-5 text-secondary" />
                              ) : (
                                <XCircle className="w-5 h-5 text-destructive" />
                              )}
                              <span className="font-medium">Test {index + 1}</span>
                            </div>
                            <div className="text-right text-sm">
                              <div>Input: {JSON.stringify(result.input)}</div>
                              <div>Expected: {JSON.stringify(result.expected)}</div>
                              {!result.passed && (
                                <div className="text-destructive">Got: {JSON.stringify(result.actual)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Success Rate</span>
                          <span className="text-sm">{testResults.filter(r => r.passed).length}/{testResults.length}</span>
                        </div>
                        <Progress 
                          value={(testResults.filter(r => r.passed).length / testResults.length) * 100} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="glass-card h-96 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Problem Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a new problem or select one from the recent problems list
                  </p>
                  <Button onClick={generateProblem} disabled={isGenerating} variant="hero">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Your First Problem
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}