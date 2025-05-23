"use client"

import Image from "next/image"
import { useSession } from "next-auth/react"

import { cn } from "../lib/utils"
import CustomLink from "./custom-link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import React from "react"
import { Button } from "./ui/button"
import { RoleGuard } from "./role-guard"
import SessionRefreshButton from "./session-refresh-button"

export function MainNav() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0">
          <Image
            src="/logo.png"
            alt="Home"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </Button>
      </CustomLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-2">
              Examples
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/server-example" title="RSC Example">
                  Protecting React Server Component.
                </ListItem>
                <ListItem href="/middleware-example" title="Middleware Example">
                  Using Middleware to protect pages & APIs.
                </ListItem>
                <ListItem href="/api-example" title="Route Handler Example">
                  Getting the session inside an API Route.
                </ListItem>
                <ListItem href="/client-example" title="Client Side Example">
                  Using session on the client side.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Role-based navigation items */}
          <RoleGuard requiredRole="moderator">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/moderator"
                className={navigationMenuTriggerStyle()}
              >
                Moderator
              </NavigationMenuLink>
            </NavigationMenuItem>
          </RoleGuard>

          <RoleGuard requiredRole="admin">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin"
                className={navigationMenuTriggerStyle()}
              >
                Admin
              </NavigationMenuLink>
            </NavigationMenuItem>
          </RoleGuard>

          {/* Show user role if logged in */}
          {session?.user?.role && (
            <>
              <NavigationMenuItem>
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Role: {session.user.role}
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <SessionRefreshButton
                  variant="ghost"
                  size="sm"
                  className="px-4 py-2"
                />
              </NavigationMenuItem>
            </>
          )}

          {/* Development tools - only shown in development */}
          {process.env.NODE_ENV === 'development' && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                Dev Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[200px]">
                  <ListItem href="/dev/session" title="Session Debug">
                    View current session details
                  </ListItem>
                  <ListItem href="/dev/make-admin" title="Make Admin">
                    Set your user as admin
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
