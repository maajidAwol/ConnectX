import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, Tag, MoreHorizontal } from "lucide-react"

export function CategoryTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management Tips</CardTitle>
        <CardDescription>Best practices for organizing your products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Structure Your Categories</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Create a logical hierarchy with main categories and subcategories to help customers find products easily.
            </p>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Use Clear Names</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose descriptive, specific category names that customers would naturally search for or browse.
            </p>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2 mb-2">
              <MoreHorizontal className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Limit Category Depth</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Try to keep your category structure to 3 levels deep or less to avoid confusing customers.
            </p>
          </div>
        </div>

        <div className="rounded-md border p-4 bg-blue-50 text-blue-800">
          <p className="text-sm">
            <strong>Pro Tip:</strong> Categories with too many products can be overwhelming. Consider splitting large
            categories into more specific subcategories when they exceed 50-100 products.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
