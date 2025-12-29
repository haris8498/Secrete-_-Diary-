import { useRef } from 'react';
import { BookOpen, Download, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { DiaryEntry } from '@/types/diary';

interface DiaryHeaderProps {
  entries: DiaryEntry[];
  onImport: (json: string) => boolean;
  onLock: () => void;
  entryCount: number;
}

export const DiaryHeader = ({ entries, onImport, onLock, entryCount }: DiaryHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Secret Diary', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sortedEntries.forEach((entry) => {
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      // Entry date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(new Date(entry.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), margin, yPosition);
      yPosition += 7;

      // Entry title
      doc.setFontSize(14);
      doc.text(entry.title, margin, yPosition);
      yPosition += 8;

      // Entry content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(entry.content, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 10; // Space between entries
    });

    doc.save(`secret-diary-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Diary Exported',
      description: 'Your diary has been saved as a PDF file.',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      
      if (success) {
        toast({
          title: 'Diary Imported',
          description: 'Your diary entries have been restored.',
        });
      } else {
        toast({
          title: 'Import Failed',
          description: 'The file format is invalid.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif tracking-wide text-foreground">Secret Diary</h1>
              <p className="text-xs text-muted-foreground">
                {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button variant="outline" size="sm" onClick={handleImportClick} className="gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onLock} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};