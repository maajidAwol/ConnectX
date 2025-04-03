import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity as RecentActivityType } from "@/types/developer"
import { Activity, AlertCircle, CheckCircle, PlusCircle } from "lucide-react"

interface RecentActivityProps {
  activities?: RecentActivityType[]
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getActivityIcon = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'project_created':
        return <PlusCircle className="h-4 w-4" />
      case 'integration_added':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.details}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 