import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ListChecks, Send, Save } from "lucide-react";
import { PBC_TEMPLATES, type PBCTemplate } from "@/lib/pbcTemplates";

interface PBCTemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (tasks: PBCTemplate["tasks"], sendInvite: boolean) => void;
}

export function PBCTemplatePicker({ open, onOpenChange, onSelect }: PBCTemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PBCTemplate | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  const categories = [...new Set(PBC_TEMPLATES.map((t) => t.category))];

  // When a template is selected, check all tasks by default
  useEffect(() => {
    if (selectedTemplate) {
      setCheckedTasks(new Set(selectedTemplate.tasks.map((_, i) => i)));
    }
  }, [selectedTemplate]);

  const handleApply = (sendInvite: boolean) => {
    if (selectedTemplate) {
      const filteredTasks = selectedTemplate.tasks.filter((_, i) => checkedTasks.has(i));
      if (filteredTasks.length === 0) return;
      onSelect(filteredTasks, sendInvite);
      setSelectedTemplate(null);
      setCheckedTasks(new Set());
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setCheckedTasks(new Set());
    onOpenChange(false);
  };

  const toggleTask = (index: number) => {
    setCheckedTasks(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectedCount = checkedTasks.size;
  const totalCount = selectedTemplate?.tasks.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            PBC Task Templates
          </DialogTitle>
          <DialogDescription>
            Choose a template to create document requests for this client. You can send the portal invite immediately or save tasks and send later.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 max-h-[40vh]">
          <div className="space-y-4 pr-2">
            {categories.map((category) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </h4>
                <div className="space-y-2">
                  {PBC_TEMPLATES.filter((t) => t.category === category).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-accent bg-accent/5 ring-1 ring-accent"
                          : "border-border bg-card hover:border-accent/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-foreground text-sm">{template.name}</h5>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.tasks.length} tasks • {template.tasks.filter((t) => t.priority === "high").length} high priority
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {selectedTemplate && (
          <div className="border-t border-border pt-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">
                Tasks in "{selectedTemplate.name}"
              </h4>
              <span className="text-xs text-muted-foreground">
                {selectedCount} of {totalCount} selected
              </span>
            </div>
            <ScrollArea className="max-h-[180px]">
              <ul className="space-y-1.5 pr-2">
                {selectedTemplate.tasks.map((task, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs py-1 cursor-pointer group"
                    onClick={() => toggleTask(i)}
                  >
                    <Checkbox
                      checked={checkedTasks.has(i)}
                      onCheckedChange={() => toggleTask(i)}
                      className="mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className={`flex items-start gap-2 ${
                      checkedTasks.has(i) ? "text-foreground" : "text-muted-foreground line-through"
                    }`}>
                      <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        task.priority === "high" ? "bg-destructive" :
                        task.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                      }`} />
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <div className="flex gap-3 flex-shrink-0 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleApply(false)}
            disabled={!selectedTemplate || selectedCount === 0}
          >
            <Save className="h-4 w-4" />
            Save Only
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={() => handleApply(true)}
            disabled={!selectedTemplate || selectedCount === 0}
          >
            <Send className="h-4 w-4" />
            Apply & Send Invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
