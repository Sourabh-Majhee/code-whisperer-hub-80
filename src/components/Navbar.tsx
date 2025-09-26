import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, Brain, Trophy, User, LogIn } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CodeMentor AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/editor" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Code className="w-4 h-4" />
              <span>Code Editor</span>
            </Link>
            <Link 
              to="/practice" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Brain className="w-4 h-4" />
              <span>Practice</span>
            </Link>
            <Link 
              to="/hackathon" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Trophy className="w-4 h-4" />
              <span>Hackathons</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="hero" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-card border-t border-border mt-2 rounded-lg p-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/editor" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Code className="w-4 h-4" />
                <span>Code Editor</span>
              </Link>
              <Link 
                to="/practice" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Brain className="w-4 h-4" />
                <span>Practice</span>
              </Link>
              <Link 
                to="/hackathon" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Trophy className="w-4 h-4" />
                <span>Hackathons</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}