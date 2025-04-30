"use client"

import { useCallback } from "react"
import { User } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserHeader() {
  // Use primitive selectors to prevent unnecessary rerenders
  const user = useAuthStore((state) => state.user)
  const logoutFn = useAuthStore((state) => state.logout)
  
  // Memoize the logout function to prevent rerenders
  const logout = useCallback(() => {
    logoutFn()
  }, [logoutFn])

  // Get user's initials from name
  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
      : 'U';
  };
  
  const userInitials = user ? getInitials(user.name) : 'U';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <Button variant="ghost" className="relative h-12 w-12 rounded-full"> */}
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">{userInitials}</span>
            </div>
          {/* </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {user?.role || "user"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 