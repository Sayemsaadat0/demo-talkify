interface DashboardSidebarItem {
  id: string;
  label: string;
  role?: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: DashboardSidebarItem[];
  type?: "item" | "divider" | "group-title";
}

/**
 * Checks if a user has the required permission for a sidebar item
 * @param item - The sidebar item to check
 * @param permissions - Array of user permissions
 * @returns true if the item should be visible, false otherwise
 */
export function hasPermissionForItem(item: DashboardSidebarItem, permissions: string[]): boolean {
  // Global items (no role) are always visible
  if (!item.role) {
    return true;
  }
  
  // Check if user has the required permission
  return permissions.includes(item.role);
}

/**
 * Checks if a user has the required permission for a dropdown menu item
 * @param item - The dropdown menu item to check
 * @param permissions - Array of user permissions
 * @returns true if the item should be visible, false otherwise
 */
export function hasPermissionForDropdownItem(item: DropdownMenuDataItem, permissions: string[]): boolean {
  // Global items (no role) are always visible
  if (!item.role) {
    return true;
  }
  
  // Check if user has the required permission
  return permissions.includes(item.role);
}

export function filterSidebarItemsByPermission(
  items: DashboardSidebarItem[],
  permissions: string[] | undefined
): DashboardSidebarItem[] {
  // If no permissions provided, return all items
  if (!permissions || !Array.isArray(permissions)) {
    return items;
  }

  return items
    .map((item) => {
      // Handle items with children
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterSidebarItemsByPermission(item.children, permissions);
        return {
          ...item,
          children: filteredChildren,
        };
      }
      return item;
    })
    .filter((item) => {
      // For group titles, only show if they have visible children
      if (item.type === "group-title") {
        return item.children && item.children.length > 0;
      }
      
      // For regular items, check role permission
      return hasPermissionForItem(item, permissions);
    });
}

// Interface for dropdown menu items
export interface DropdownMenuDataItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: string;
  iconBg?: string;
  iconColor?: string;
  href?: string;
  subItems?: DropdownMenuDataItem[];
}

/**
 * Filters dropdown menu items based on user permissions
 * @param items - Array of dropdown menu items
 * @param permissions - Array of user permissions
 * @returns Filtered array of menu items
 */
export function filterDropdownMenuItems(
  items: DropdownMenuDataItem[],
  permissions: string[] | undefined
): DropdownMenuDataItem[] {
  // If no permissions provided, return only global items
  if (!permissions || !Array.isArray(permissions)) {
    return items.filter(item => !item.role);
  }

  return items
    .map((item) => {
      // Handle items with sub-items
      if (item.subItems && item.subItems.length > 0) {
        const filteredSubItems = filterDropdownMenuItems(item.subItems, permissions);
        return {
          ...item,
          subItems: filteredSubItems,
        };
      }
      return item;
    })
    .filter((item) => {
      // For items with sub-items, only show if they have visible sub-items
      if (item.subItems && item.subItems.length > 0) {
        return item.subItems.length > 0;
      }
      
      // For regular items, check role permission
      return hasPermissionForDropdownItem(item, permissions);
    });
}
