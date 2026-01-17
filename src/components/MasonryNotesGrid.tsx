import React from 'react';
import { Note } from '@/types/note';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MasonryNotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  isSelectionMode?: boolean;
  selectedNoteIds?: string[];
  onToggleSelection?: (noteId: string) => void;
}

// Get background color based on note type or custom color
const getNoteColor = (note: Note): string => {
  // If note has a custom color, use it
  if (note.color) return note.color;
  
  // Default colors by type
  const typeColors: Record<string, string> = {
    sticky: 'hsl(48, 100%, 67%)', // Yellow
    lined: 'hsl(210, 100%, 80%)', // Light blue
    regular: 'hsl(145, 80%, 75%)', // Light green
    sketch: 'hsl(280, 80%, 80%)', // Light purple
    code: 'hsl(35, 100%, 75%)', // Light orange
    mindmap: 'hsl(340, 80%, 80%)', // Light pink
    expense: 'hsl(180, 60%, 75%)', // Light teal
  };
  
  return typeColors[note.type] || 'hsl(0, 0%, 90%)';
};

// Extract plain text from HTML content
const getPlainText = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const MasonryNotesGrid: React.FC<MasonryNotesGridProps> = ({
  notes,
  onEdit,
  isSelectionMode = false,
  selectedNoteIds = [],
  onToggleSelection,
}) => {
  // Split notes into two columns for masonry effect
  const leftColumn: Note[] = [];
  const rightColumn: Note[] = [];
  
  notes.forEach((note, index) => {
    if (index % 2 === 0) {
      leftColumn.push(note);
    } else {
      rightColumn.push(note);
    }
  });

  const renderNoteCard = (note: Note) => {
    const bgColor = getNoteColor(note);
    const plainContent = getPlainText(note.content);
    const isSelected = selectedNoteIds.includes(note.id);
    
    // Determine card height based on content length
    const contentLength = plainContent.length;
    const hasLongContent = contentLength > 100;
    
    return (
      <div
        key={note.id}
        onClick={() => {
          if (isSelectionMode && onToggleSelection) {
            onToggleSelection(note.id);
          } else {
            onEdit(note);
          }
        }}
        className={cn(
          "rounded-xl p-4 cursor-pointer transition-all duration-200",
          "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
          "break-inside-avoid mb-3",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        style={{ 
          backgroundColor: bgColor,
        }}
      >
        {/* Title */}
        {note.title && (
          <h3 className="font-bold text-foreground text-base leading-tight mb-2 line-clamp-2">
            {note.title}
          </h3>
        )}
        
        {/* Content preview */}
        {plainContent && (
          <p className="text-foreground/80 text-sm leading-relaxed mb-3 line-clamp-4">
            {truncateText(plainContent, 150)}
          </p>
        )}
        
        {/* Date badge */}
        <div className="inline-block">
          <span className="text-xs font-medium text-foreground/70 bg-background/30 px-2.5 py-1 rounded-full">
            {format(new Date(note.updatedAt), 'MM/dd/yy h:mm a')}
          </span>
        </div>
      </div>
    );
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3">
      {/* Left column */}
      <div className="flex-1 flex flex-col">
        {leftColumn.map(renderNoteCard)}
      </div>
      
      {/* Right column */}
      <div className="flex-1 flex flex-col">
        {rightColumn.map(renderNoteCard)}
      </div>
    </div>
  );
};

export default MasonryNotesGrid;
