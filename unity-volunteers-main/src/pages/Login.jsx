import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Lock, Chrome, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [volunteerData, setVolunteerData] = useState({ email: '', password: '' });
    const [ngoData, setNgoData] = useState({ email: '', password: '' });

    const handleVolunteerChange = (e) => setVolunteerData({ ...volunteerData, [e.target.id.replace('-volunteer', '')]: e.target.value });
    const handleNgoChange = (e) => setNgoData({ ...ngoData, [e.target.id.replace('-ngo', '')]: e.target.value });

    const handleVolunteerSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', volunteerData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.volunteer));
            window.dispatchEvent(new Event('authChange')); // Dispatch event
            toast({ title: "Login Successful!", description: "Welcome back to VolunteerConnect." });
            navigate('/');
        } catch (err) {
            handleLoginError(err);
        }
    };

    const handleNgoSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/ngo/login', ngoData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.ngo));
            window.dispatchEvent(new Event('authChange')); // Dispatch event
            toast({ title: "NGO Login Successful!", description: "Welcome to your dashboard." });
            navigate('/profile'); // Navigate directly to the dashboard
        } catch (err) {
            handleLoginError(err);
        }
    };
    
    const handleLoginError = (err) => {
        console.error(err.response?.data);
        toast({
            title: "Login Failed",
            description: err.response?.data?.message || "Invalid credentials.",
            variant: "destructive",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <Card className="w-full max-w-md p-8 bg-card backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="h-8 w-8 text-primary fill-current" />
                            <span className="text-2xl font-bold hero-text">VolunteerConnect</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to continue your journey</p>
                    </div>

                    <Tabs defaultValue="volunteer" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                            <TabsTrigger value="ngo">NGO</TabsTrigger>
                        </TabsList>
                        
                        {/* Volunteer Login Form */}
                        <TabsContent value="volunteer">
                            <form onSubmit={handleVolunteerSubmit} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-volunteer">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-volunteer" type="email" placeholder="your@email.com" className="pl-10" value={volunteerData.email} onChange={handleVolunteerChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-volunteer">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-volunteer" type="password" placeholder="Enter your password" className="pl-10" value={volunteerData.password} onChange={handleVolunteerChange} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" size="lg">Sign In as Volunteer</Button>
                                <div className="mt-6 text-center text-sm">
                                    <span className="text-muted-foreground">Don't have an account? </span>
                                    <Link to="/signup" className="text-primary hover:underline font-medium">Sign up here</Link>
                                </div>
                            </form>
                        </TabsContent>

                        {/* NGO Login Form */}
                        <TabsContent value="ngo">
                            <form onSubmit={handleNgoSubmit} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-ngo">NGO Email</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-ngo" type="email" placeholder="ngo@email.com" className="pl-10" value={ngoData.email} onChange={handleNgoChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-ngo">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-ngo" type="password" placeholder="Enter your password" className="pl-10" value={ngoData.password} onChange={handleNgoChange} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" size="lg">Sign In as NGO</Button>
                                <div className="mt-6 text-center text-sm">
                                    <span className="text-muted-foreground">Don't have an NGO account? </span>
                                    <Link to="/ngo-signup" className="text-primary hover:underline font-medium">Register here</Link>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default Login;

