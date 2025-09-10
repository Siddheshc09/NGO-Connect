import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NgoSignup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shortInfo: '',
        founded: '',
        founder: '',
        aim: '',
        location: '',
        website: '',
        achievements: '',
        categories: ''
    });

    const { name, email, password, shortInfo, founded, founder, aim, location, website, achievements, categories } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const newNgo = {
                name,
                email,
                password,
                shortInfo,
                founded,
                founder,
                aim,
                location,
                website,
                // Split comma-separated strings into arrays
                achievements: achievements.split(',').map(item => item.trim()),
                categories: categories.split(',').map(item => item.trim())
            };

            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify(newNgo);
            const res = await axios.post('http://localhost:5001/api/auth/ngo/signup', body, config);

            // Store auth data and notify the app of the change
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.ngo));
            window.dispatchEvent(new Event('authChange'));

            toast({
                title: "NGO Signup Successful!",
                description: "Welcome to VolunteerConnect. You are now logged in.",
            });

            // Navigate directly to the NGO dashboard profile page
            navigate('/profile');
        } catch (err) {
            console.error(err.response?.data);
            toast({
                title: "Signup Failed",
                description: err.response?.data?.message || "Something went wrong. Please check all fields.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
                <Card className="w-full max-w-2xl p-8 bg-card backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="h-8 w-8 text-primary fill-current" />
                            <span className="text-2xl font-bold hero-text">VolunteerConnect</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Register Your NGO</h1>
                        <p className="text-muted-foreground">Join our network to find passionate volunteers</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">NGO Name</Label>
                                <Input id="name" value={name} onChange={onChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Official Email</Label>
                                <Input id="email" type="email" value={email} onChange={onChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={onChange} required minLength="6" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortInfo">Short Info</Label>
                            <Input id="shortInfo" value={shortInfo} onChange={onChange} required placeholder="A brief one-liner about your NGO" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="founded">Year Founded</Label>
                                <Input id="founded" value={founded} onChange={onChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="founder">Founder's Name</Label>
                                <Input id="founder" value={founder} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aim">Mission/Aim</Label>
                            <Textarea id="aim" value={aim} onChange={onChange} required />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location (City, State)</Label>
                                <Input id="location" value={location} onChange={onChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website URL</Label>
                                <Input id="website" type="url" value={website} onChange={onChange} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="achievements">Key Achievements (comma-separated)</Label>
                            <Input id="achievements" value={achievements} onChange={onChange} placeholder="Planted 10k trees, Educated 500 children" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categories">Categories (comma-separated)</Label>
                            <Input id="categories" value={categories} onChange={onChange} placeholder="Environment, Education, Healthcare" />
                        </div>

                        <Button type="submit" className="w-full" size="lg">Register NGO</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default NgoSignup;

