import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { DiaryEntry as DiaryEntryType } from '@/types/diary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onUpdate: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const DiaryEntryCard = ({ entry, onUpdate, onDelete }: DiaryEntryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);

  const handleSave = () => {
    onUpdate(entry.id, title, content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(entry.title);
    setContent(entry.content);
    setIsEditing(false);
  };

  const formattedDate = format(new Date(entry.date), 'EEEE, MMMM d, yyyy');

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur transition-all hover:bg-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 flex-1 text-left"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-medium tracking-wider uppercase mb-1">
                {formattedDate}
              </p>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="text-lg font-serif bg-input border-border"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="text-lg font-serif text-foreground truncate">
                  {entry.title || 'Untitled Entry'}
                </h3>
              )}
            </div>
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isEditing ? (
              <>
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
                  <Save className="w-4 h-4 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    setIsEditing(true);
                  }} 
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 hover:text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this diary entry. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-secondary">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(entry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              className="min-h-[150px] bg-input border-border resize-none"
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {entry.content || 'No content'}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};