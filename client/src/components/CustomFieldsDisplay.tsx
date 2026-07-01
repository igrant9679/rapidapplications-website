import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Mail, FileText, CheckCircle2, XCircle } from "lucide-react";

interface CustomFieldsDisplayProps {
  contentType: string;
  contentId: number;
}

export default function CustomFieldsDisplay({ contentType, contentId }: CustomFieldsDisplayProps) {
  const { data: fields = [], isLoading } = trpc.customFields.getFieldsByContentTypePublic.useQuery({
    contentType,
  });

  const { data: values = [] } = trpc.customFields.getFieldValuesByContentPublic.useQuery({
    entityType: contentType === "post" ? "post" : "page",
    entityId: contentId,
  });

  if (isLoading) {
    return null;
  }

  // Filter fields that have values
  const fieldsWithValues = fields.filter((field: any) => {
    const value = values.find((v: any) => v.fieldId === field.id);
    return value && value.value;
  });

  if (fieldsWithValues.length === 0) {
    return null;
  }

  const renderFieldValue = (field: any) => {
    const valueObj = values.find((v: any) => v.fieldId === field.id);
    if (!valueObj || !valueObj.value) return null;

    const value = valueObj.value;

    switch (field.fieldType) {
      case "url":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        );

      case "email":
        return (
          <a
            href={`mailto:${value}`}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            {value}
          </a>
        );

      case "date":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {new Date(value).toLocaleDateString()}
          </div>
        );

      case "checkbox":
        return value === "true" || value === "1" ? (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Yes
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <XCircle className="h-4 w-4" />
            No
          </div>
        );

      case "file":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            View File
          </a>
        );

      case "textarea":
        return (
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {value}
          </div>
        );

      case "select":
        return (
          <Badge variant="secondary" className="font-normal">
            {value}
          </Badge>
        );

      default:
        return <span className="text-foreground">{value}</span>;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsWithValues.map((field: any) => (
            <div key={field.id} className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                {field.fieldName}
              </dt>
              <dd className="text-sm">{renderFieldValue(field)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
