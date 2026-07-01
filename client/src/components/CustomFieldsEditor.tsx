import { trpc } from "@/lib/trpc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CustomFieldsEditorProps {
  contentType: string;
  contentId?: number;
  values: Record<string, any>;
  onChange: (fieldSlug: string, value: any) => void;
}

export function CustomFieldsEditor({
  contentType,
  contentId,
  values,
  onChange,
}: CustomFieldsEditorProps) {
  // Fetch custom fields for this content type
  const { data: fields, isLoading } = trpc.customFields.listFields.useQuery({
    contentType,
  });

  // Fetch existing values if editing
  const { data: existingValuesArray } = trpc.customFields.getFieldValues.useQuery(
    {
      entityType: contentType as "post" | "page" | "custom_post_item",
      entityId: contentId!,
    },
    {
      enabled: !!contentId,
    }
  );

  // Convert array to map for easier lookup
  const existingValues: Record<string, string> = {};
  if (existingValuesArray) {
    existingValuesArray.forEach((item: any) => {
      // Find the field to get its slug
      const field = fields?.find((f: any) => f.id === item.fieldId);
      if (field) {
        existingValues[field.slug] = item.value;
      }
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fields || fields.length === 0) {
    return null;
  }

  const renderField = (field: { id: number; name: string; slug: string; type: string; description?: string | null; defaultValue?: string | null; isRequired: number; options?: string | null }) => {
    const fieldValue = values[field.slug] ?? existingValues?.[field.slug] ?? field.defaultValue ?? "";

    switch (field.type) {
      case "text":
      case "url":
      case "email":
        return (
          <Input
            type={field.type}
            value={fieldValue}
            onChange={(e) => onChange(field.slug, e.target.value)}
            placeholder=""
            required={field.isRequired === 1}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={fieldValue}
            onChange={(e) => onChange(field.slug, e.target.value)}
            placeholder=""
            required={field.isRequired === 1}
            rows={4}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={fieldValue}
            onChange={(e) => onChange(field.slug, parseFloat(e.target.value) || 0)}
            placeholder=""
            required={field.isRequired === 1}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={fieldValue}
            onChange={(e) => onChange(field.slug, e.target.value)}
            required={field.isRequired === 1}
          />
        );

      case "select":
        const options = field.options ? JSON.parse(field.options) : [];
        return (
          <Select
            value={fieldValue}
            onValueChange={(value) => onChange(field.slug, value)}
            required={field.isRequired === 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fieldValue === true || fieldValue === "true"}
              onCheckedChange={(checked) => onChange(field.slug, checked)}
            />
            <span className="text-sm text-muted-foreground">
              Enable this option
            </span>
          </div>
        );

      case "file":
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // For now, just store the filename
                  // In production, you'd upload to S3 and store the URL
                  onChange(field.slug, file.name);
                }
              }}
              required={field.isRequired === 1 && !fieldValue}
            />
            {fieldValue && (
              <p className="text-sm text-muted-foreground">Current: {fieldValue}</p>
            )}
          </div>
        );

      default:
        return (
          <Input
            value={fieldValue}
            onChange={(e) => onChange(field.slug, e.target.value)}
            placeholder=""
            required={field.isRequired === 1}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={`field-${field.slug}`}>
              {field.name}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div id={`field-${field.slug}`}>{renderField(field)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
