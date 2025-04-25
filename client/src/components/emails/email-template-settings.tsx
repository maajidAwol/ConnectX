import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"

interface EmailTemplateSettingsProps {
  template: any
}

export function EmailTemplateSettings({ template }: EmailTemplateSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Set as Default Template</h3>
          <p className="text-sm text-muted-foreground">
            Use this template as the default for this type of communication
          </p>
        </div>
        <Switch defaultChecked={template?.isDefault} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Automatic Sending</h3>
          <p className="text-sm text-muted-foreground">Send this email automatically when triggered</p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Include Order Details</h3>
          <p className="text-sm text-muted-foreground">Automatically include full order details in the email</p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cc-emails">CC Recipients (Optional)</Label>
        <Input id="cc-emails" placeholder="email@example.com, another@example.com" />
        <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas</p>
      </div>

      <div className="rounded-md border p-4 bg-muted/50">
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span>Template Triggers</span>
        </h3>
        <p className="text-sm mt-1">This template is automatically sent when:</p>
        <ul className="mt-2 text-sm space-y-1">
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            <span>A customer places a new order</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            <span>An order is manually created by a staff member</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
