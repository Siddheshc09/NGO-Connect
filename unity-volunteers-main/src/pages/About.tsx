import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Target, Workflow, Heart, Globe, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

const About = () => {
  const teamMembers = [
    { name: "Priya Sharma", role: "Founder & CEO", bio: "Social impact veteran with 10+ years in NGO management" },
    { name: "Rajesh Kumar", role: "CTO", bio: "Technology leader passionate about using tech for social good" },
    { name: "Anita Patel", role: "Head of Partnerships", bio: "Expert in building relationships between volunteers and NGOs" },
    { name: "Mohit Singh", role: "Community Manager", bio: "Dedicated to growing our volunteer community" },
  ];

  const steps = [
    {
      icon: Users,
      title: "NGOs Register",
      description: "NGOs sign up and create profiles showcasing their mission and campaigns"
    },
    {
      icon: Target,
      title: "Campaigns Listed",
      description: "Organizations list their volunteer opportunities with detailed information"
    },
    {
      icon: Globe,
      title: "Volunteers Discover",
      description: "Volunteers browse campaigns and find causes they're passionate about"
    },
    {
      icon: Heart,
      title: "Impact Created",
      description: "NGOs connect with volunteers to execute meaningful projects together"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="hero-text">VolunteerConnect</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make volunteering accessible, impactful, and rewarding for everyone. 
            Connecting hearts, hands, and hope to build stronger communities.
          </p>
        </div>
      </section>

      {/* Our Aim */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Aim</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To create a seamless bridge between passionate volunteers and impactful NGOs, 
              fostering collaboration that drives meaningful social change in communities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center card-hover">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Global Impact</h3>
              <p className="text-muted-foreground">Connecting volunteers worldwide with local and international causes</p>
            </Card>
            
            <Card className="p-6 text-center card-hover">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community Building</h3>
              <p className="text-muted-foreground">Creating lasting relationships between volunteers and organizations</p>
            </Card>
            
            <Card className="p-6 text-center card-hover">
              <Award className="h-12 w-12 text-tertiary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Measurable Change</h3>
              <p className="text-muted-foreground">Tracking and celebrating the real impact of volunteer efforts</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How This Platform Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, transparent process that connects volunteers with meaningful opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals working to connect volunteers with meaningful opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center card-hover">
                <div className="w-20 h-20 bg-gradient-card rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  👤
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-xs">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;