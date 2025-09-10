import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award, Target, MapPin, Globe } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const NGOs = () => {
  const [ngos, setNgos] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/ngos');
        setNgos(res.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not fetch NGOs.",
          variant: "destructive",
        });
      }
    };

    fetchNgos();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our NGO <span className="hero-text">Partners</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the incredible organizations working tirelessly to create positive change in communities
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {ngos.map((ngo) => (
              <Card key={ngo._id} className="overflow-hidden card-hover">
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{ngo.logo || '🤝'}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{ngo.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{ngo.shortInfo}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ngo.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Founded in {ngo.founded}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {ngo.location}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {ngo.website}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Learn More</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <span className="text-3xl">{ngo.logo || '🤝'}</span>
                          <span className="text-2xl">{ngo.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Organization Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div><strong>Founded:</strong> {ngo.founded}</div>
                              <div><strong>Founder:</strong> {ngo.founder}</div>
                              <div><strong>Location:</strong> {ngo.location}</div>
                              <div><strong>Website:</strong> <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{ngo.website}</a></div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                              <Target className="h-4 w-4 mr-2" />
                              Our Mission
                            </h3>
                            <p className="text-sm text-muted-foreground">{ngo.aim}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Focus Areas</h3>
                          <div className="flex flex-wrap gap-2">
                            {ngo.categories.map((category, index) => (
                              <Badge key={index} variant="outline">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            Key Achievements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ngo.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3">Campaigns</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ngo.campaigns && ngo.campaigns.length > 0 ? (
                              ngo.campaigns.map((campaign) => (
                                <Card key={campaign._id} className="p-4">
                                  <h4 className="font-medium mb-1 text-sm">{campaign.title}</h4>
                                  <p className="text-xs text-muted-foreground mb-2">{new Date(campaign.date).toLocaleDateString()}</p>
                                  <p className="text-xs">{campaign.description}</p>
                                </Card>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground col-span-3">No campaigns listed yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NGOs;
