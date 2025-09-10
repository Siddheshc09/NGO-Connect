import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ManageEvents = () => {
    const { toast } = useToast();
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [newCampaignData, setNewCampaignData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        fullDescription: '',
        category: '',
        timeRequired: ''
    });

    const fetchNgoCampaigns = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.get('http://localhost:5001/api/campaigns/my-campaigns', config);
            setCampaigns(res.data);
        } catch (error) {
            console.error('Failed to fetch campaigns', error);
            toast({
                title: 'Error',
                description: 'Could not fetch your campaigns.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNgoCampaigns();
    }, []);

    const handleInputChange = (e, formType) => {
        const { id, value } = e.target;
        if (formType === 'new') {
            setNewCampaignData({ ...newCampaignData, [id]: value });
        } else {
            setEditingCampaign({ ...editingCampaign, [id]: value });
        }
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            const body = JSON.stringify(newCampaignData);
            await axios.post('http://localhost:5001/api/campaigns', body, config);

            toast({ title: 'Success', description: 'New campaign created successfully.' });
            setIsAddDialogOpen(false);
            fetchNgoCampaigns(); // Refresh the list
            setNewCampaignData({ title: '', date: '', location: '', description: '', fullDescription: '', category: '', timeRequired: '' }); // Reset form
        } catch (err) {
            console.error(err.response.data);
            toast({
                title: 'Creation Failed',
                description: err.response.data.message || 'Could not create the campaign.',
                variant: 'destructive',
            });
        }
    };
    
    const handleUpdateCampaign = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            const body = JSON.stringify(editingCampaign);
            await axios.put(`http://localhost:5001/api/campaigns/${editingCampaign._id}`, body, config);

            toast({ title: 'Success', description: 'Campaign updated successfully.' });
            setIsEditDialogOpen(false);
            fetchNgoCampaigns(); // Refresh the list
        } catch (err) {
            console.error(err.response.data);
            toast({
                title: 'Update Failed',
                description: err.response.data.message || 'Could not update the campaign.',
                variant: 'destructive',
            });
        }
    };

    const openEditDialog = (campaign) => {
        setEditingCampaign({
            ...campaign,
            date: campaign.date ? new Date(campaign.date).toISOString().split('T')[0] : ''
        });
        setIsEditDialogOpen(true);
    };

    if (isLoading) {
        return <div className="p-8">Loading campaigns...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Your Campaigns</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New Campaign</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Campaign</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateCampaign} className="space-y-4">
                            {/* Form fields for creating a new campaign */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Campaign Title</Label>
                                <Input id="title" value={newCampaignData.title} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={newCampaignData.date} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={newCampaignData.location} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea id="description" value={newCampaignData.description} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullDescription">Full Description</Label>
                                <Textarea id="fullDescription" value={newCampaignData.fullDescription} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={newCampaignData.category} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="timeRequired">Time Required</Label>
                                <Input id="timeRequired" value={newCampaignData.timeRequired} onChange={(e) => handleInputChange(e, 'new')} required />
                            </div>
                            <Button type="submit" className="w-full">Create Campaign</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <Card key={campaign._id} className="p-4 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground">{new Date(campaign.date).toLocaleDateString()}</p>
                            <p className="text-sm mt-2">{campaign.description}</p>
                        </div>
                        <Button className="mt-4 w-full" onClick={() => openEditDialog(campaign)}>Edit Campaign</Button>
                    </Card>
                ))}
            </div>

            {/* Edit Campaign Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Campaign: {editingCampaign?.title}</DialogTitle>
                    </DialogHeader>
                    {editingCampaign && (
                        <form onSubmit={handleUpdateCampaign} className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="title">Campaign Title</Label>
                                <Input id="title" value={editingCampaign.title} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={editingCampaign.date} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={editingCampaign.location} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea id="description" value={editingCampaign.description} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="fullDescription">Full Description</Label>
                                <Textarea id="fullDescription" value={editingCampaign.fullDescription} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={editingCampaign.category} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeRequired">Time Required</Label>
                                <Input id="timeRequired" value={editingCampaign.timeRequired} onChange={(e) => handleInputChange(e, 'edit')} required />
                            </div>
                            <Button type="submit" className="w-full">Update Campaign</Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageEvents;

