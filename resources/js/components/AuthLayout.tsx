import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
const authBg = '/lovable-uploads/f79c8a91-7753-4751-8606-1624c268d377.png';
const bayanLogo = '/lovable-uploads/c220bffd-33c5-49db-b365-5c1a2681bdc8.png';

const AuthLayout: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(formData.username, formData.password);
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to the system",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-contain bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/60" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Lending System</h1>
          <p className="text-xl opacity-90 mb-6">
            Secure financial management system
          </p>
          <div className="space-y-3 text-sm opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Secure and reliable lending platform</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Easy loan management and tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Comprehensive member services</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={bayanLogo} 
                alt="Bayan ng Tungawan Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Bayang Tungawan</h2>
          </div>

          <Card className="border-border/50 shadow-[var(--shadow-soft)]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input-enhanced"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-enhanced"
                    placeholder="Enter your password"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-primary"
                  size="lg"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;