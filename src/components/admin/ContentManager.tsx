
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, FileText, Image, MoreHorizontal, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Demo page data
const pages = [
  { id: 1, title: 'Home', path: '/', status: 'Published', author: 'Admin', lastModified: '2 days ago' },
  { id: 2, title: 'About', path: '/about', status: 'Published', author: 'Admin', lastModified: '1 week ago' },
  { id: 3, title: 'Contact', path: '/contact', status: 'Published', author: 'Admin', lastModified: '3 days ago' },
  { id: 4, title: 'Privacy Policy', path: '/privacy', status: 'Published', author: 'Admin', lastModified: '1 month ago' },
  { id: 5, title: 'Upcoming Features', path: '/upcoming-features', status: 'Draft', author: 'John', lastModified: 'Today' },
];

// Demo media data
const media = [
  { id: 1, name: 'hero-image.jpg', type: 'Image', size: '1.2 MB', dimensions: '1920x1080', uploaded: '3 days ago' },
  { id: 2, name: 'logo.png', type: 'Image', size: '0.4 MB', dimensions: '512x512', uploaded: '1 month ago' },
  { id: 3, name: 'product-demo.mp4', type: 'Video', size: '8.5 MB', dimensions: '1280x720', uploaded: '1 week ago' },
  { id: 4, name: 'whitepaper.pdf', type: 'Document', size: '2.1 MB', dimensions: 'N/A', uploaded: '2 weeks ago' },
];

export const ContentManager: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'Draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Manager</h2>
        <p className="text-muted-foreground">Manage your website pages and media</p>
      </div>
      
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:space-y-0">
              <CardTitle>Pages</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search pages..." className="pl-8 w-full sm:w-[200px] lg:w-[250px]" />
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground">{page.path}</TableCell>
                      <TableCell>{getStatusBadge(page.status)}</TableCell>
                      <TableCell>{page.author}</TableCell>
                      <TableCell>{page.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit page</DropdownMenuItem>
                            <DropdownMenuItem>View page</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {page.status === 'Published' ? (
                              <DropdownMenuItem>Unpublish</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Publish</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:space-y-0">
              <CardTitle>Media Library</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search files..." className="pl-8 w-full sm:w-[200px] lg:w-[250px]" />
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {media.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.dimensions}</TableCell>
                      <TableCell>{item.uploaded}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Copy URL</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Replace</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
