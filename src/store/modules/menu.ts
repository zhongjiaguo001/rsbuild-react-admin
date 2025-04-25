// src/stores/menuStore.ts
import { create } from "zustand";
import { MenuItem } from "../types/route";

interface MenuState {
  menus: MenuItem[];
  flattenedMenuPaths: string[];
  selectedKeys: string[];
  setMenus: (menus: MenuItem[]) => void;
  setSelectedKeys: (keys: string[]) => void;
}

// 将菜单树扁平化为路径数组
function flattenMenus(menus: MenuItem[]): string[] {
  const result: string[] = [];

  function traverse(items: MenuItem[], parentPath: string = "") {
    items.forEach((item) => {
      const fullPath = parentPath ? `${parentPath}${item.path}` : item.path;
      result.push(fullPath);

      if (item.children && item.children.length > 0) {
        traverse(item.children, fullPath);
      }
    });
  }

  traverse(menus);
  return result;
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  flattenedMenuPaths: [],
  selectedKeys: [],

  setMenus: (menus: MenuItem[]) => {
    const flattenedPaths = flattenMenus(menus);
    set({ menus, flattenedMenuPaths: flattenedPaths });
  },

  setSelectedKeys: (keys: string[]) => set({ selectedKeys: keys }),
}));
