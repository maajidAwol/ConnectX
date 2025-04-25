"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, PencilLine, Send } from "lucide-react"

interface EmailTemplateEditorProps {
  template: any
  templateContent: string
  onTemplateContentChange: (content: string) => void
  onSaveTemplate: () => void
  isSaving: boolean
  editMode: boolean
  onToggleEditMode: () => void
}

export function EmailTemplateEditor({
  template,
  templateContent,
  onTemplateContentChange,
  onSaveTemplate,
  isSaving,
  editMode,
  onToggleEditMode,
}: EmailTemplateEditorProps) {
  const placeholders = [
    { name: "customer_name", label: "{{customer_name}}" },
    { name: "order_id", label: "{{order_id}}" },
    { name: "order_date", label: "{{order_date}}" },
    { name: "order_total", label: "{{order_total}}" },
    { name: "store_name", label: "{{store_name}}" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{template?.name}</h3>
          <p className="text-sm text-muted-foreground">{template?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={onToggleEditMode}>
            <PencilLine className="h-4 w-4" />
            <span>{editMode ? "Cancel" : "Edit"}</span>
          </Button>
          {editMode && (
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onSaveTemplate} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Email Subject</Label>
        <Input id="subject" value={template?.subject} disabled={!editMode} />
        <p className="text-xs text-muted-foreground">Use placeholders like {{ order_id }} for dynamic content</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Email Content</Label>
        {editMode ? (
          <Textarea
            id="content"
            value={templateContent}
            onChange={(e) => onTemplateContentChange(e.target.value)}
            className="min-h-[300px] font-mono"
          />
        ) : (
          <div className="rounded-md border p-4 min-h-[300px] bg-muted/50 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: templateContent }} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {placeholders.map((placeholder) => (
          <Badge
            key={placeholder.name}
            variant="outline"
            className="cursor-pointer hover:bg-muted"
            onClick={() => editMode && onTemplateContentChange(templateContent + placeholder.label)}
          >
            {placeholder.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
