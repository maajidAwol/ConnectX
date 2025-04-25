import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare, Save, Settings, Smartphone } from "lucide-react"

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notification Settings</h2>
        <p className="text-muted-foreground">Configure platform notification settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Configure notification delivery channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Send notifications via email</span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Send notifications to mobile devices</span>
              </Label>
              <Switch id="push-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                <span>SMS Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Send notifications via SMS</span>
              </Label>
              <Switch id="sms-notifications" />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="in-app-notifications" className="flex flex-col space-y-1">
                <span>In-App Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Show notifications within the platform
                </span>
              </Label>
              <Switch id="in-app-notifications" defaultChecked />
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-4">SMS Configuration</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <select
                  id="sms-provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws-sns">AWS SNS</option>
                  <option value="messagebird">MessageBird</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-from">From Number</Label>
                <Input id="sms-from" defaultValue="+15551234567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-api-key">API Key</Label>
                <Input id="sms-api-key" type="password" defaultValue="********" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-api-secret">API Secret</Label>
                <Input id="sms-api-secret" type="password" defaultValue="********" />
              </div>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-4">Push Notification Configuration</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="push-provider">Push Provider</Label>
                <select
                  id="push-provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="firebase">Firebase Cloud Messaging</option>
                  <option value="onesignal">OneSignal</option>
                  <option value="aws-sns">AWS SNS</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="push-api-key">API Key</Label>
                <Input id="push-api-key" type="password" defaultValue="********" />
              </div>
            </div>
          </div>

          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Channel Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Configure which events trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">System Notifications</h3>
            <div className="space-y-4">
              {[
                {
                  id: "system-maintenance",
                  title: "System Maintenance",
                  description: "Notifications about scheduled maintenance",
                  channels: {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true,
                  },
                },
                {
                  id: "system-outage",
                  title: "System Outage",
                  description: "Notifications about system outages",
                  channels: {
                    email: true,
                    push: true,
                    sms: true,
                    inApp: true,
                  },
                },
                {
                  id: "feature-updates",
                  title: "Feature Updates",
                  description: "Notifications about new features and updates",
                  channels: {
                    email: true,
                    push: false,
                    sms: false,
                    inApp: true,
                  },
                },
              ].map((notification) => (
                <div key={notification.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 mb-2">
                        <Mail className="h-4 w-4 text-blue-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.email} />
                      <span className="text-xs mt-1">Email</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 mb-2">
                        <Smartphone className="h-4 w-4 text-purple-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.push} />
                      <span className="text-xs mt-1">Push</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mb-2">
                        <MessageSquare className="h-4 w-4 text-green-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.sms} />
                      <span className="text-xs mt-1">SMS</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 mb-2">
                        <Bell className="h-4 w-4 text-amber-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.inApp} />
                      <span className="text-xs mt-1">In-App</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Merchant Notifications</h3>
            <div className="space-y-4">
              {[
                {
                  id: "merchant-registration",
                  title: "Merchant Registration",
                  description: "Notifications about new merchant registrations",
                  channels: {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true,
                  },
                },
                {
                  id: "merchant-approval",
                  title: "Merchant Approval",
                  description: "Notifications about merchant approval status changes",
                  channels: {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true,
                  },
                },
                {
                  id: "merchant-suspension",
                  title: "Merchant Suspension",
                  description: "Notifications about merchant account suspensions",
                  channels: {
                    email: true,
                    push: true,
                    sms: true,
                    inApp: true,
                  },
                },
              ].map((notification) => (
                <div key={notification.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 mb-2">
                        <Mail className="h-4 w-4 text-blue-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.email} />
                      <span className="text-xs mt-1">Email</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 mb-2">
                        <Smartphone className="h-4 w-4 text-purple-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.push} />
                      <span className="text-xs mt-1">Push</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mb-2">
                        <MessageSquare className="h-4 w-4 text-green-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.sms} />
                      <span className="text-xs mt-1">SMS</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 mb-2">
                        <Bell className="h-4 w-4 text-amber-700" />
                      </div>
                      <Switch size="sm" checked={notification.channels.inApp} />
                      <span className="text-xs mt-1">In-App</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
