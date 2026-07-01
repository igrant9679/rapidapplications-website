import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical, Edit, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MenuItem {
  id: number;
  label: string;
  type: string;
  url?: string;
  menuOrder: number;
  children?: MenuItem[];
}

function SortableMenuItem({ item, onEdit, onDelete }: { item: MenuItem; onEdit: (item: MenuItem) => void; onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-card border rounded-lg mb-2"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{item.label}</div>
        <div className="text-sm text-muted-foreground">
          {item.type === "custom" ? item.url : `${item.type}`}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(item)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function AdminMenus() {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [menuForm, setMenuForm] = useState({
    name: "",
    slug: "",
    description: "",
    location: "",
  });

  const [itemForm, setItemForm] = useState({
    label: "",
    type: "custom" as "custom" | "page" | "post" | "category" | "tag" | "post-type",
    url: "",
    targetId: "",
    cssClasses: "",
    target: "_self",
  });

  const { data: menus, refetch: refetchMenus } = trpc.menu.getAllMenus.useQuery();
  const { data: menuItems, refetch: refetchItems } = trpc.menu.getMenuItemsHierarchical.useQuery(
    { menuId: selectedMenu! },
    { enabled: !!selectedMenu }
  );

  const createMenuMutation = trpc.menu.createMenu.useMutation({
    onSuccess: () => {
      toast.success("Menu created successfully");
      refetchMenus();
      setIsCreateMenuOpen(false);
      setMenuForm({ name: "", slug: "", description: "", location: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createItemMutation = trpc.menu.createMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item created successfully");
      refetchItems();
      setIsCreateItemOpen(false);
      setItemForm({
        label: "",
        type: "custom",
        url: "",
        targetId: "",
        cssClasses: "",
        target: "_self",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateItemMutation = trpc.menu.updateMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item updated successfully");
      refetchItems();
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteItemMutation = trpc.menu.deleteMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item deleted successfully");
      refetchItems();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const reorderMutation = trpc.menu.reorderMenuItems.useMutation({
    onSuccess: () => {
      refetchItems();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && menuItems) {
      const flatItems = menuItems.flat();
      const oldIndex = flatItems.findIndex((item) => item.id === active.id);
      const newIndex = flatItems.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(flatItems, oldIndex, newIndex);
      const reorderedItems = newOrder.map((item, index) => ({
        id: item.id,
        menuOrder: index,
        parentId: item.parentId,
      }));

      reorderMutation.mutate({ items: reorderedItems });
    }
  };

  const handleCreateMenu = () => {
    createMenuMutation.mutate(menuForm);
  };

  const handleCreateItem = () => {
    if (!selectedMenu) return;

    createItemMutation.mutate({
      menuId: selectedMenu,
      label: itemForm.label,
      type: itemForm.type,
      url: itemForm.url || undefined,
      targetId: itemForm.targetId ? parseInt(itemForm.targetId) : undefined,
      cssClasses: itemForm.cssClasses || undefined,
      target: itemForm.target,
      menuOrder: menuItems?.length || 0,
      isVisible: 1,
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      label: item.label,
      type: item.type as any,
      url: item.url || "",
      targetId: "",
      cssClasses: "",
      target: "_self",
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    updateItemMutation.mutate({
      id: editingItem.id,
      data: {
        label: itemForm.label,
        type: itemForm.type,
        url: itemForm.url || undefined,
        cssClasses: itemForm.cssClasses || undefined,
        target: itemForm.target,
      },
    });
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteItemMutation.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu Builder</h1>
        <Dialog open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Menu Name</Label>
                <Input
                  id="name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  placeholder="Main Menu"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={menuForm.slug}
                  onChange={(e) => setMenuForm({ ...menuForm, slug: e.target.value })}
                  placeholder="main-menu"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={menuForm.location}
                  onValueChange={(value) => setMenuForm({ ...menuForm, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateMenu} className="w-full">
                Create Menu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu List */}
        <Card>
          <CardHeader>
            <CardTitle>Menus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menus?.map((menu) => (
                <Button
                  key={menu.id}
                  variant={selectedMenu === menu.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedMenu(menu.id)}
                >
                  {menu.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedMenu ? menus?.find((m) => m.id === selectedMenu)?.name : "Select a menu"}
              </CardTitle>
              {selectedMenu && (
                <Dialog open={isCreateItemOpen || !!editingItem} onOpenChange={(open) => {
                  setIsCreateItemOpen(open);
                  if (!open) setEditingItem(null);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit" : "Add"} Menu Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="label">Label</Label>
                        <Input
                          id="label"
                          value={itemForm.label}
                          onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                          placeholder="Home"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={itemForm.type}
                          onValueChange={(value: any) => setItemForm({ ...itemForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">Custom Link</SelectItem>
                            <SelectItem value="page">Page</SelectItem>
                            <SelectItem value="post">Post</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="tag">Tag</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {itemForm.type === "custom" && (
                        <div>
                          <Label htmlFor="url">URL</Label>
                          <Input
                            id="url"
                            value={itemForm.url}
                            onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                            placeholder="/about"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="cssClasses">CSS Classes</Label>
                        <Input
                          id="cssClasses"
                          value={itemForm.cssClasses}
                          onChange={(e) => setItemForm({ ...itemForm, cssClasses: e.target.value })}
                          placeholder="Optional CSS classes"
                        />
                      </div>
                      <Button onClick={editingItem ? handleUpdateItem : handleCreateItem} className="w-full">
                        {editingItem ? "Update" : "Add"} Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedMenu && menuItems ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map((item) => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {selectedMenu ? "No menu items yet" : "Select a menu to manage items"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
