import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Plus, 
  Clock,
  Target,
  Award,
  MapPin,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_participants: number | null;
  prize_pool: string | null;
  rules: string | null;
  created_by: string;
  created_at: string;
  status: string;
}

export default function Hackathon() {
  const [user, setUser] = useState<any>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    max_participants: "",
    prize_pool: "",
    rules: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    initializeUser();
    loadHackathons();
    
    // Set up real-time subscription for hackathons
    const subscription = supabase
      .channel('hackathons')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hackathons' },
        () => loadHackathons()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadHackathons = async () => {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('start_date', { ascending: true });

    if (!error && data) {
      // Filter out expired hackathons
      const now = new Date().toISOString();
      const activeHackathons = data.filter(h => h.end_date > now);
      
      // Delete expired hackathons
      const expiredHackathons = data.filter(h => h.end_date <= now);
      if (expiredHackathons.length > 0) {
        await supabase
          .from('hackathons')
          .delete()
          .in('id', expiredHackathons.map(h => h.id));
      }
      
      setHackathons(activeHackathons);
    }
  };

  const createHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create hackathons.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('hackathons')
        .insert({
          ...formData,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          created_by: user.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Hackathon created!",
        description: "Your hackathon has been published successfully.",
      });

      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        registration_deadline: "",
        max_participants: "",
        prize_pool: "",
        rules: ""
      });
      loadHackathons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create hackathon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerForHackathon = async (hackathonId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for hackathons.",
        variant: "destructive",
      });
      return;
    }

    // Update user progress
    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        hackathons_participated: 1,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    toast({
      title: "Registration successful!",
      description: "You've been registered for the hackathon.",
    });
  };

  const deleteHackathon = async (hackathonId: string) => {
    const { error } = await supabase
      .from('hackathons')
      .delete()
      .eq('id', hackathonId);

    if (!error) {
      toast({
        title: "Hackathon deleted",
        description: "The hackathon has been removed.",
      });
      loadHackathons();
    }
  };

  const getStatusBadge = (hackathon: Hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.start_date);
    const endDate = new Date(hackathon.end_date);
    const regDeadline = new Date(hackathon.registration_deadline);

    if (now > endDate) {
      return <Badge variant="outline">Ended</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge className="bg-accent/10 text-accent">Live</Badge>;
    } else if (now > regDeadline) {
      return <Badge variant="secondary">Registration Closed</Badge>;
    } else {
      return <Badge className="bg-secondary/10 text-secondary">Open</Badge>;
    }
  };

  const isRegistrationOpen = (hackathon: Hackathon) => {
    const now = new Date();
    const regDeadline = new Date(hackathon.registration_deadline);
    const startDate = new Date(hackathon.start_date);
    return now <= regDeadline && now < startDate;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hackathons</h1>
            <p className="text-muted-foreground">
              Compete, collaborate, and showcase your coding skills
            </p>
          </div>
          
          {user && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hackathon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Hackathon</DialogTitle>
                  <DialogDescription>
                    Set up a new hackathon event for the community
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createHackathon} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prize_pool">Prize Pool</Label>
                      <Input
                        id="prize_pool"
                        value={formData.prize_pool}
                        onChange={(e) => setFormData({...formData, prize_pool: e.target.value})}
                        placeholder="$10,000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration_deadline">Registration Deadline</Label>
                      <Input
                        id="registration_deadline"
                        type="datetime-local"
                        value={formData.registration_deadline}
                        onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="max_participants">Max Participants (optional)</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rules">Rules & Guidelines</Label>
                    <Textarea
                      id="rules"
                      value={formData.rules}
                      onChange={(e) => setFormData({...formData, rules: e.target.value})}
                      placeholder="Describe the rules, judging criteria, and guidelines..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Hackathon"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="glass-card hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                  {getStatusBadge(hackathon)}
                </div>
                <CardDescription className="line-clamp-2">
                  {hackathon.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{format(new Date(hackathon.start_date), 'MMM dd')} - {format(new Date(hackathon.end_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Register by {format(new Date(hackathon.registration_deadline), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {hackathon.max_participants && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Max {hackathon.max_participants} participants</span>
                    </div>
                  )}
                  
                  {hackathon.prize_pool && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{hackathon.prize_pool} prize pool</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  {isRegistrationOpen(hackathon) ? (
                    <Button 
                      onClick={() => registerForHackathon(hackathon.id)}
                      variant="success"
                      size="sm"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Register
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Registration Closed
                    </Button>
                  )}
                  
                  {user && user.id === hackathon.created_by && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteHackathon(hackathon.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {hackathon.rules && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View Rules & Guidelines
                    </summary>
                    <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
                      {hackathon.rules}
                    </p>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {hackathons.length === 0 && (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Hackathons</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a hackathon for the community!
              </p>
              {user && (
                <Button onClick={() => setIsCreateModalOpen(true)} variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Hackathon
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}