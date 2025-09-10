import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const CampaignPreview = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { toast } = useToast();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isVolunteer = user && user.fullName;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/campaigns');
        setCampaigns(res.data.slice(0, 3)); // Only show first 3
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      }
    };
    fetchCampaigns();
  }, []);
  
  const handleRegisterClick = (campaign) => {
    const token = localStorage.getItem('token');
    if (!token || !isVolunteer) {
      toast({
        title: "Login Required",
        description: "You must be logged in as a volunteer to register.",
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
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`http://localhost:5001/api/campaigns/${selectedCampaign._id}/register`, {}, config);
        
        toast({
            title: "Registration Successful!",
            description: `You've registered for "${selectedCampaign.title}".`,
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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ongoing Campaigns
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover meaningful volunteer opportunities and make a difference in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="overflow-hidden card-hover">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" />{new Date(campaign.date).toLocaleDateString()}</div>
                  <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-2" />{campaign.location}</div>
                  <div className="flex items-center text-muted-foreground"><Users className="h-4 w-4 mr-2" />{campaign.registeredVolunteers.length} volunteers registered</div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary font-medium">{campaign.ngo?.name || 'NGO'}</span>
                    {isVolunteer && (
                      <Button size="sm" variant="default" onClick={() => handleRegisterClick(campaign)}>Register</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/campaigns">Show More Campaigns</Link>
          </Button>
        </div>
      </div>

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
    </section>
  );
};

export default CampaignPreview;
