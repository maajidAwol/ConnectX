"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { emailTemplates } from "@/lib/data"

import { PageHeader } from "@/components/ui/page-header"
import { SearchBar } from "@/components/ui/search-bar"
import { EmailTemplateList } from "@/components/emails/email-template-list"
import { EmailTemplateEditor } from "@/components/emails/email-template-editor"
import { EmailTemplatePreview } from "@/components/emails/email-template-preview"
import { EmailTemplateSettings } from "@/components/emails/email-template-settings"

export default function EmailTemplates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0])
  const [editMode, setEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Template content (in a real app, this would be part of the template data)
  const [templateContent, setTemplateContent] = useState(`
    <p>Dear {{customer_name}},</p>
    <p>Thank you for your order with {{store_name}}. We're pleased to confirm that your order #{{order_id}} has been received and is being processed.</p>
    <p><strong>Order Details:</strong></p>
    <ul>
      <li>Order Number: {{order_id}}</li>
      <li>Order Date: {{order_date}}</li>
      <li>Total Amount: {{order_total}}</li>
    </ul>
    <p>You can track your order status by logging into your account or clicking the button below.</p>
    <p>Thank you for choosing {{store_name}}. We appreciate your business!</p>
    <p>Best regards,<br>The {{store_name}} Team</p>
  `)

  // Filter templates based on search
  const filteredTemplates = emailTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Save template changes
  const handleSaveTemplate = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setEditMode(false)
    }, 1500)
  }

  // Handle template selection
  const handleSelectTemplate = (template: (typeof emailTemplates)[0]) => {
    setSelectedTemplate(template)
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Email Templates" description="Manage email communications with your customers">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>New Template</span>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <SearchBar placeholder="Search templates..." value={searchQuery} onChange={setSearchQuery} />

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Available Templates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EmailTemplateList
                templates={filteredTemplates}
                selectedTemplateId={selectedTemplate?.id}
                onSelectTemplate={handleSelectTemplate}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8">
          <Tabs defaultValue="edit" className="space-y-4">
            <TabsList>
              <TabsTrigger value="edit">Edit Template</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <Card>
                <CardContent className="pt-6">
                  <EmailTemplateEditor
                    template={selectedTemplate}
                    templateContent={templateContent}
                    onTemplateContentChange={setTemplateContent}
                    onSaveTemplate={handleSaveTemplate}
                    isSaving={isSaving}
                    editMode={editMode}
                    onToggleEditMode={() => setEditMode(!editMode)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailTemplatePreview template={selectedTemplate} templateContent={templateContent} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailTemplateSettings template={selectedTemplate} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
