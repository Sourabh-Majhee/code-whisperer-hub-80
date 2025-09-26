import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Brain, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Star, 
  Award,
  Flame,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Lines Explained", value: "2,847", icon: Brain, color: "text-primary" },
  { label: "Problems Solved", value: "156", icon: Target, color: "text-secondary" },
  { label: "Hackathons Won", value: "3", icon: Trophy, color: "text-accent" },
  { label: "Current Streak", value: "12 days", icon: Flame, color: "text-orange-500" },
];

const recentActivity = [
  { 
    type: "explanation", 
    title: "Explained Binary Search Algorithm", 
    time: "2 hours ago",
    icon: Brain,
    color: "bg-primary/10 text-primary"
  },
  { 
    type: "practice", 
    title: "Completed Array Manipulation Challenge", 
    time: "5 hours ago",
    icon: CheckCircle,
    color: "bg-secondary/10 text-secondary"
  },
  { 
    type: "hackathon", 
    title: "Joined AI Innovation Hackathon", 
    time: "1 day ago",
    icon: Trophy,
    color: "bg-accent/10 text-accent"
  },
];

const skillProgress = [
  { skill: "Python", progress: 85, level: "Advanced" },
  { skill: "JavaScript", progress: 72, level: "Intermediate" },
  { skill: "Data Structures", progress: 68, level: "Intermediate" },
  { skill: "Algorithms", progress: 55, level: "Beginner" },
];

const upcomingEvents = [
  {
    title: "React Native Hackathon",
    date: "Dec 15-17, 2024",
    participants: "500+ developers",
    prize: "$10,000"
  },
  {
    title: "AI/ML Challenge",
    date: "Jan 8-10, 2025",
    participants: "300+ developers",
    prize: "$5,000"
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground">Track your progress and continue your coding journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Skill Progress</span>
                </CardTitle>
                <CardDescription>Your learning journey across different technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2 progress-glow" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full justify-start" asChild>
                  <Link to="/editor">
                    <Code className="w-4 h-4 mr-2" />
                    Start Coding
                  </Link>
                </Button>
                <Button variant="success" className="w-full justify-start" asChild>
                  <Link to="/practice">
                    <Target className="w-4 h-4 mr-2" />
                    Practice Problems
                  </Link>
                </Button>
                <Button variant="practice" className="w-full justify-start" asChild>
                  <Link to="/hackathon">
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Hackathon
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
                  <Star className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-sm">First Explanation</p>
                    <p className="text-xs text-muted-foreground">Unlocked AI explanation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                  <Flame className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Week Streak</p>
                    <p className="text-xs text-muted-foreground">7 days in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Hackathon Winner</p>
                    <p className="text-xs text-muted-foreground">First place finish</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                    <h4 className="font-medium text-sm mb-2">{event.title}</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{event.date}</p>
                      <p>{event.participants}</p>
                      <p className="text-accent font-medium">Prize: {event.prize}</p>
                    </div>
                    <Button variant="glass" size="sm" className="w-full mt-3">
                      Register Now
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}