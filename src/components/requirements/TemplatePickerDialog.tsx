import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Sparkles } from "lucide-react";
import { requirementTemplates, RequirementTemplate } from "./RequirementTemplates";

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: RequirementTemplate) => void;
  onStartBlank: () => void;
}

export function TemplatePickerDialog({
  open,
  onOpenChange,
  onSelectTemplate,
  onStartBlank,
}: TemplatePickerDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (template: RequirementTemplate) => {
    setSelectedId(template.id);
  };

  const handleContinue = () => {
    if (selectedId) {
      const template = requirementTemplates.find((t) => t.id === selectedId);
      if (template) {
        onSelectTemplate(template);
        setSelectedId(null);
      }
    }
  };

  const handleStartBlank = () => {
    setSelectedId(null);
    onStartBlank();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedId(null);
    }
    onOpenChange(newOpen);
  };

  // Group templates by category
  const categories = requirementTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, RequirementTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Requirement
          </DialogTitle>
          <DialogDescription>
            Start with a template or create from scratch.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-4">
            {/* Start from scratch option */}
            <button
              onClick={handleStartBlank}
              className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Start from scratch</p>
                  <p className="text-sm text-muted-foreground">
                    Create a custom requirement with your own content
                  </p>
                </div>
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or use a template
                </span>
              </div>
            </div>

            {/* Templates by category */}
            {Object.entries(categories).map(([category, templates]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {category}
                </h3>
                <div className="grid gap-3">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    const isSelected = selectedId === template.id;
                    
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelect(template)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? "bg-primary/10" : "bg-muted"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isSelected ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}>
                                {template.title}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {template.suggestedFrequency === "annual" ? "Annual" : "One-time"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {selectedId && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border -mx-6 px-6">
            <Button
              variant="outline"
              onClick={() => setSelectedId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleContinue}
            >
              Use Template
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
