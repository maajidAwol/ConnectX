"use client"

import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EmailTemplateListProps {
  templates: any[]
  selectedTemplateId: string
  onSelectTemplate: (template: any) => void
}

export function EmailTemplateList({ templates, selectedTemplateId, onSelectTemplate }: EmailTemplateListProps) {
  return (
    <div className="max-h-[500px] overflow-auto">
      {templates.map((template) => (
        <button
          key={template.id}
          className={`w-full text-left border-b last:border-0 p-4 hover:bg-muted/50 transition-colors ${
            selectedTemplateId === template.id ? "bg-blue-50" : ""
          }`}
          onClick={() => onSelectTemplate(template)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{template.name}</div>
            {template.isDefault && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Default
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Last edited: {template.lastEdit}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
