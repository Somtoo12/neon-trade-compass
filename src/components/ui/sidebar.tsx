
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "group fixed top-0 bottom-0 z-[100] flex shrink-0 flex-col border-r bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out",
  {
    variants: {
      size: {
        sm: "w-[70px] [&[data-collapsed=true]]:w-[70px]",
        default: "w-[220px] [&[data-collapsed=true]]:w-[70px]",
        lg: "w-[240px] [&[data-collapsed=true]]:w-[70px]",
      },
      position: {
        left: "left-0",
        right: "right-0 border-l border-r-0",
      },
    },
    defaultVariants: {
      size: "default",
      position: "left",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
}

interface SidebarProviderState {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
}

const SidebarContext = React.createContext<SidebarProviderState>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  const providerValue = React.useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
    }),
    [collapsed, toggleCollapsed]
  )

  return (
    <SidebarContext.Provider value={providerValue}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, size, position, collapsed: propCollapsed, ...props }, ref) => {
    const { collapsed: contextCollapsed } = useSidebar()
    const collapsed = propCollapsed !== undefined ? propCollapsed : contextCollapsed

    return (
      <div
        ref={ref}
        data-collapsed={collapsed}
        className={cn(sidebarVariants({ size, position, className }))}
        {...props}
      />
    )
  }
)

Sidebar.displayName = "Sidebar"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-y-auto py-2", className)}
      {...props}
    />
  )
})

SidebarContent.displayName = "SidebarContent"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 shrink-0 items-center border-b px-4",
        className
      )}
      {...props}
    />
  )
})

SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 shrink-0 items-center border-t px-4",
        className
      )}
      {...props}
    />
  )
})

SidebarFooter.displayName = "SidebarFooter"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 py-1.5", className)}
      {...props}
    />
  )
})

SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    />
  )
})

SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar()

  if (collapsed) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "px-2.5 text-xs font-medium text-muted-foreground mb-1.5",
        className
      )}
      {...props}
    />
  )
})

SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      role="list"
      className={cn("min-w-full", className)}
      {...props}
    />
  )
})

SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("px-0.5", className)}
      {...props}
    />
  )
})

SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
    hasSubmenu?: boolean
  }
>(({ className, active, hasSubmenu, ...props }, ref) => {
  const { collapsed } = useSidebar()

  return (
    <a
      ref={ref}
      className={cn(
        "group/item flex w-full items-center rounded-lg p-2.5 text-sm",
        "outline-none ring-1 ring-transparent transition-all",
        "focus-visible:ring-ring hover:bg-muted/40",
        active
          ? "bg-muted/50 font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
        { "justify-center": collapsed },
        className
      )}
      {...props}
    >
      <div className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center">
        {props.children?.[0]}
      </div>
      {!collapsed && (
        <>
          <span className="w-full truncate">
            {React.Children.toArray(props.children).slice(1)}
          </span>
          {hasSubmenu && (
            <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-hover/item:text-foreground" />
          )}
        </>
      )}
    </a>
  )
})

SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarTrigger = () => {
  const { toggleCollapsed } = useSidebar()
  return (
    <button
      aria-label="Toggle Menu"
      onClick={toggleCollapsed}
      className="fixed left-0 top-0 z-[101] p-3 text-muted-foreground hover:text-foreground"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-menu"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>
  )
}

SidebarTrigger.displayName = "SidebarTrigger"

// Export sidebar components
export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}

