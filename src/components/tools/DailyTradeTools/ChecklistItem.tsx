
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ChecklistItemProps {
  id: string;
  text: string;
  checked: boolean;
  isCustom?: boolean;
  onToggle: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  onDelete?: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  checked,
  isCustom,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    if (onEdit) {
      const newText = window.prompt('Edit checklist item:', text);
      if (newText && newText.trim() !== '') {
        onEdit(id, newText.trim());
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={() => onToggle(id)}
        />
        <Label 
          htmlFor={id}
          className={checked ? "line-through opacity-70" : ""}
        >
          {text}
        </Label>
      </div>
      
      {isCustom && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:text-destructive"
            onClick={() => onDelete?.(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;
