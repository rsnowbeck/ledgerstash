import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ListChecks, Send, Save } from "lucide-react";
import { PBC_TEMPLATES, type PBCTemplate } from "@/lib/pbcTemplates";

interface PBCTemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (tasks: PBCTemplate["tasks"], sendInvite: boolean) => void;
}

export function PBCTemplatePicker({ open, onOpenChange, onSelect }: PBCTemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PBCTemplate | null>(null);

  const categories = [...new Set(PBC_TEMPLATES.map((t) => t.category))];

  const handleApply = (sendInvite: boolean) => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.tasks, sendInvite);
      setSelectedTemplate(null);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            PBC Task Templates
          </DialogTitle>
          <DialogDescription>
            Choose a template to create document requests for this client. You can send the portal invite immediately or save tasks and send later.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4">
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
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Tasks in "{selectedTemplate.name}"
            </h4>
            <ScrollArea className="max-h-32">
              <ul className="space-y-1">
                {selectedTemplate.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      task.priority === "high" ? "bg-destructive" :
                      task.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                    }`} />
                    {task.title}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleApply(false)}
            disabled={!selectedTemplate}
          >
            <Save className="h-4 w-4" />
            Save Only
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={() => handleApply(true)}
            disabled={!selectedTemplate}
          >
            <Send className="h-4 w-4" />
            Apply & Send Invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
