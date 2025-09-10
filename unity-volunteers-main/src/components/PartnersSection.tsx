import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Calendar, MapPin, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';


const CampaignPreview = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/campaigns');
        // Display only the first 3 campaigns for the preview
        setCampaigns(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not fetch campaign previews.",
          variant: "destructive",
        });
      }
    };

    fetchCampaigns();
  }, [toast]);
  
  const handleRegisterClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsRegistrationOpen(true);
  };
  
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to register for a campaign.",
        variant: "destructive",
      });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`http://localhost:5001/api/campaigns/${selectedCampaign._id}/register`, {}, config);

      toast({
        title: "Registration Successful!",
        description: `You've successfully registered for "${selectedCampaign.title}". The NGO will contact you soon.`,
      });

      setIsRegistrationOpen(false);
      setSelectedCampaign(null);
    } catch (err) {
      console.error(err.response.data);
      toast({
        title: "Registration Failed",
        description: err.response.data.message || "Something went wrong.",
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
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-10 bg-card"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="overflow-hidden card-hover">
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{campaign.image || '🌱'}</div>
                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(campaign.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {campaign.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {campaign.registeredVolunteers.length} volunteers registered
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary font-medium">{campaign.ngo.name}</span>
                    <Button size="sm" variant="default" onClick={() => handleRegisterClick(campaign)}>
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/campaigns">
              Show More Campaigns
            </Link>
          </Button>
        </div>
      </div>
       <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {selectedCampaign?.title}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Confirm your registration for this event. Your details will be shared with the organizing NGO.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="consent" defaultChecked required />
              <Label htmlFor="consent" className="text-sm">
                I consent to share my information and participate.
              </Label>
            </div>
            
            <Button type="submit" className="w-full">
              Confirm Registration
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CampaignPreview;
