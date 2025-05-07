
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { SiteSettings } from '@/components/admin/SiteSettings';
import { ContentManager } from '@/components/admin/ContentManager';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuth } from '@/components/admin/AdminAuth';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('admin-dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }
        
        // In a real app, you would check against your users table to verify admin role
        // This is just a placeholder implementation
        const isAdminUser = session.user.email === 'admin@example.com';
        setIsAdmin(isAdminUser);
        
        if (!isAdminUser) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking auth status', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminAuth setIsAdmin={setIsAdmin} />;
  }

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <Helmet>
        <title>Admin Control Panel | PipCraft</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <ContentManager />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminPage;
