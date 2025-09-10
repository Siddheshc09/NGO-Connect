import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const { toast } = useToast();

    // Check user type from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const isVolunteer = user && user.fullName;

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/campaigns');
                setCampaigns(res.data);
            } catch (error) {
                console.error("Failed to fetch campaigns", error);
                toast({
                    title: "Error",
                    description: "Could not fetch campaigns.",
                    variant: "destructive",
                });
            }
        };
        fetchCampaigns();
    }, [toast]);

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRegister = (campaign) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: "Login Required",
                description: "You need to be logged in as a volunteer to register.",
                variant: "destructive",
            });
            return;
        }
        setSelectedCampaign(campaign);
        setIsRegistrationOpen(true);
    };

    const handleSubmitRegistration = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`http://localhost:5001/api/campaigns/${selectedCampaign._id}/register`, {}, config);
            
            toast({
                title: "Registration Successful!",
                description: `You've successfully registered for "${selectedCampaign.title}".`,
            });
            setIsRegistrationOpen(false);
            setSelectedCampaign(null);
        } catch (err) {
            console.error(err.response?.data);
            toast({
                title: "Registration Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            
            <section className="py-16 bg-gradient-subtle">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        NGO <span className="hero-text">Campaigns</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Discover meaningful volunteer opportunities and make a lasting impact in your community
                    </p>
                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search campaigns, NGOs, or categories..." 
                            className="pl-10 bg-card"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <Card key={campaign._id} className="overflow-hidden card-hover">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" />{new Date(campaign.date).toLocaleDateString()}</div>
                                        <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-2" />{campaign.location}</div>
                                        <div className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-2" />{campaign.timeRequired}</div>
                                        <div className="flex items-center text-muted-foreground"><Users className="h-4 w-4 mr-2" />{campaign.registeredVolunteers.length} volunteers registered</div>
                                        <div className="flex items-center text-muted-foreground"><Tag className="h-4 w-4 mr-2" />{campaign.category}</div>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-primary font-medium">{campaign.ngo?.name || 'NGO'}</span>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full">View Details</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl">{campaign.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="font-semibold mb-2">About This Campaign</h3>
                                                        <p className="text-muted-foreground">{campaign.fullDescription}</p>
                                                    </div>
                                                    {isVolunteer && (
                                                      <Button className="w-full" onClick={() => handleRegister(campaign)}>Register for This Campaign</Button>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No campaigns found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirm Registration for {selectedCampaign?.title}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmitRegistration} className="space-y-4">
                        <p>Please confirm your details before registering.</p>
                        <div><Label>Name</Label><Input defaultValue={user?.fullName} disabled /></div>
                        <div><Label>Email</Label><Input type="email" defaultValue={user?.email} disabled /></div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" required defaultChecked />
                            <Label htmlFor="consent" className="text-sm">I agree to participate in this campaign.</Label>
                        </div>
                        <Button type="submit" className="w-full">Submit Registration</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Campaigns;
