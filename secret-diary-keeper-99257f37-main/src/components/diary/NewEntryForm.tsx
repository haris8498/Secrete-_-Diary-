import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NewEntryFormProps {
  onAdd: (date: string, title: string, content: string) => void;
  existingDates: string[];
}

export const NewEntryForm = ({ onAdd, existingDates }: NewEntryFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dateString = format(date, 'yyyy-MM-dd');
  const hasEntryForDate = existingDates.includes(dateString);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onAdd(dateString, title, content);
    setTitle('');
    setContent('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full py-6 text-lg glow"
      >
        <Plus className="w-5 h-5 mr-2" />
        Write New Entry
      </Button>
    );
  }

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif flex items-center justify-between">
          <span>New Entry</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal flex-1 bg-input border-border",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {hasEntryForDate && (
            <p className="text-sm text-primary">
              Note: An entry already exists for this date. This will create a new one.
            </p>
          )}

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title (optional)"
            className="bg-input border-border"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dear diary..."
            className="min-h-[200px] bg-input border-border resize-none"
            required
          />

          <Button type="submit" className="w-full glow" disabled={!content.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};