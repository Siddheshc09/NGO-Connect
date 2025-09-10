import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const NgoProfile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '', shortInfo: '', founded: '', founder: '', aim: '', location: '', website: '', achievements: '', categories: ''
  });

  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5001/api/ngos/me', config);
        const { achievements, categories, ...rest } = res.data;
        setFormData({
            ...rest,
            achievements: achievements.join(', '),
            categories: categories.join(', ')
        });
      } catch (error) {
        console.error("Failed to fetch NGO data", error);
        toast({ title: "Error", description: "Could not fetch your profile data." });
      }
    };
    fetchNgoData();
  }, [toast]);

  const onChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const updatedData = {
            ...formData,
            achievements: formData.achievements.split(',').map(item => item.trim()),
            categories: formData.categories.split(',').map(item => item.trim()),
        };
        await axios.put('http://localhost:5001/api/ngos/me', updatedData, config);
        toast({ title: "Success", description: "Your profile has been updated." });
    } catch (error) {
        console.error("Failed to update profile", error);
        toast({ title: "Error", description: "Could not update your profile." });
    }
  };

  return (
     <Card>
        <CardHeader>
            <CardTitle>NGO Profile</CardTitle>
            <CardDescription>Update your organization's public information here.</CardDescription>
        </CardHeader>
        <CardContent>
             <form onSubmit={onSubmit} className="space-y-4">
               {/* All input fields from NgoSignup.jsx can be reused here */}
               <div className="space-y-2">
                  <Label htmlFor="name">NGO Name</Label>
                  <Input id="name" value={formData.name} onChange={onChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortInfo">Short Info / Tagline</Label>
                  <Textarea id="shortInfo" value={formData.shortInfo} onChange={onChange} />
                </div>
                {/* ... Add all other fields from NgoSignup.jsx here, similar to the two above ... */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="founder">Founder's Name</Label>
                        <Input id="founder" value={formData.founder} onChange={onChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="founded">Year Founded</Label>
                        <Input id="founded" value={formData.founded} onChange={onChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={formData.location} onChange={onChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" value={formData.website} onChange={onChange} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="aim">Mission / Aim</Label>
                    <Textarea id="aim" value={formData.aim} onChange={onChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="categories">Focus Areas (Comma-separated)</Label>
                    <Input id="categories" value={formData.categories} onChange={onChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="achievements">Key Achievements (Comma-separated)</Label>
                    <Input id="achievements" value={formData.achievements} onChange={onChange} />
                </div>

              <Button type="submit">Save Changes</Button>
            </form>
        </CardContent>
     </Card>
  );
};

export default NgoProfile;
