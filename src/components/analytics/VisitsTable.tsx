
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitData, EventData, getEventsForVisit } from '@/services/analyticsAPI';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDownUp,
  ChevronDown,
  Eye
} from 'lucide-react';
import { formatRelative, formatDistance } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface VisitsTableProps {
  data: VisitData[];
  count: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const VisitsTable: React.FC<VisitsTableProps> = ({
  data,
  count,
  isLoading,
  currentPage,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.ceil(count / pageSize);
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Visits</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Device / Browser</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Events</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((visit) => (
                      <VisitRow key={visit.id} visit={visit} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No visits recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {data.length} of {count} visits
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Page</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {currentPage}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(0, 10) // Limit to avoid too many items
                        .map((page) => (
                          <DropdownMenuItem
                            key={page}
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <span className="text-sm text-muted-foreground">
                  of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const VisitRow: React.FC<{ visit: VisitData }> = ({ visit }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleViewEvents = async () => {
    if (!isOpen && events.length === 0) {
      setIsLoading(true);
      const eventData = await getEventsForVisit(visit.id);
      setEvents(eventData);
      setIsLoading(false);
    }
    setIsOpen(!isOpen);
  };
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-border last:border-0"
    >
      <TableRow className={isOpen ? 'bg-muted/50' : ''}>
        <TableCell className="font-medium">
          {visit.page_path === '/' ? 'Home Page' : visit.page_path}
          {visit.referrer && (
            <div className="text-xs text-muted-foreground mt-1">
              from: {formatReferrer(visit.referrer)}
            </div>
          )}
        </TableCell>
        <TableCell>
          {visit.device_type || 'Unknown'}
          {visit.browser && (
            <div className="text-xs text-muted-foreground">
              {visit.browser}
            </div>
          )}
        </TableCell>
        <TableCell>
          {visit.country || 'Unknown'}
          {visit.city && (
            <div className="text-xs text-muted-foreground">
              {visit.city} {visit.region ? `(${visit.region})` : ''}
            </div>
          )}
        </TableCell>
        <TableCell>
          <div title={new Date(visit.entered_at).toLocaleString()}>
            {formatRelative(new Date(visit.entered_at), new Date())}
          </div>
        </TableCell>
        <TableCell>
          {visit.time_on_page 
            ? formatDuration(visit.time_on_page) 
            : '-'}
        </TableCell>
        <TableCell>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleViewEvents}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </TableCell>
      </TableRow>
      
      <CollapsibleContent className="bg-muted/30 px-4 py-2 text-sm" asChild>
        <TableRow>
          <TableCell colSpan={6}>
            <h4 className="font-medium mb-2">Visit Events</h4>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs border-b pb-1 last:border-0">
                    <span className="font-medium">{event.event_type}</span>
                    {event.element_id || event.element_class ? (
                      <span className="text-muted-foreground">
                        {event.element_id ? `#${event.element_id}` : ''}
                        {event.element_class ? `.${event.element_class}` : ''}
                      </span>
                    ) : null}
                    {event.element_text && (
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        "{event.element_text}"
                      </span>
                    )}
                    {event.scroll_depth && (
                      <span>scroll: {event.scroll_depth}%</span>
                    )}
                    <span className="ml-auto">
                      {formatRelative(new Date(event.created_at), new Date())}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No events recorded</div>
            )}
          </TableCell>
        </TableRow>
      </CollapsibleContent>
    </Collapsible>
  );
};

const formatReferrer = (referrer: string) => {
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (e) {
    return referrer;
  }
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
