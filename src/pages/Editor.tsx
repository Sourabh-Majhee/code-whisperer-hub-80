import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Brain, 
  Lightbulb, 
  Code2,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Editor() {
  const [code, setCode] = useState(`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)
print(f"Sorted array: {sorted_numbers}")`);
  
  const [language, setLanguage] = useState("python");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"simple" | "detailed">("simple");
  const [confidence, setConfidence] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [output, setOutput] = useState("");
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleExplain = async (lineNumber?: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use AI explanations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('explain-code', {
        body: { code, language, lineNumber, mode }
      });

      if (error) throw error;

      setExplanation(data.explanation);
      setConfidence(data.confidence);
      setSelectedLine(lineNumber || null);

      await supabase.from('user_progress').upsert({
        user_id: user.id,
        lines_explained: 1,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      toast({
        title: "Explanation generated!",
        description: "AI has analyzed your code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate explanation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRun = () => {
    setOutput("Running code...\n");
    setTimeout(() => {
      setOutput("Running code...\nSorted array: [11, 12, 22, 25, 34, 64, 90]\nExecution completed successfully!");
    }, 1500);
  };

  const codeLines = code.split('\n');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 flex h-screen">
        <div className="w-1/2 p-6 border-r border-border">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Code Editor</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={simulateRun} size="sm" variant="success">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
            </div>

            <div className="flex-1 glass-card rounded-lg overflow-hidden">
              <div className="flex h-full">
                <div className="bg-muted/30 p-4 text-sm text-muted-foreground font-mono border-r border-border">
                  {codeLines.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-6 flex items-center justify-end pr-2 cursor-pointer hover:bg-muted/50 ${
                        selectedLine === index + 1 ? 'bg-primary/20' : ''
                      }`}
                      onClick={() => handleExplain(index + 1)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                
                <div className="flex-1">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-full resize-none border-0 font-mono text-sm bg-transparent"
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={() => handleExplain()}
                disabled={isLoading}
                variant="hero"
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Explain Code
                  </>
                )}
              </Button>
              <Select value={mode} onValueChange={(value: "simple" | "detailed") => setMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-6">
          <Tabs defaultValue="explanation" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explanation">AI Explanation</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explanation" className="h-full mt-4">
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span>AI Explanation</span>
                    </div>
                    {confidence > 0 && (
                      <Badge variant={confidence > 80 ? "default" : confidence > 60 ? "secondary" : "outline"}>
                        {confidence}% confidence
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {explanation ? (
                    <div className="space-y-4">
                      {selectedLine && (
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">Explaining line {selectedLine}</p>
                        </div>
                      )}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{explanation}</p>
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-border">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-muted-foreground">AI Generated</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Click "Explain Code" or click on a line number to get AI-powered explanations
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="output" className="h-full mt-4">
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-secondary" />
                    <span>Code Output</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {output ? (
                    <div className="bg-background border rounded-lg p-4 font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Click "Run" to execute your code and see the output
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}