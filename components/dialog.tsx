"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect } from "react";
import { Calendar } from "./ui/calendar";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "date" | "select" | "searchable-select" | 'checkbox' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean
  options?: { label: string; value: string }[];
};

type Mode = "form" | "confirm";

interface DynamicDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  mode: Mode;
  fields?: Field[]; // Only for form mode
  defaultValues?: Record<string, any>; // Used for form and confirm
  onSubmit: (data?: any) => void;
}

export default function DynamicDialogForm({
  open,
  setOpen,
  title,
  fields,
  onSubmit,
  mode,
  defaultValues = {},
}: DynamicDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // // Reset the form when defaultValues change (for edit case)
  // useEffect(() => {
  //   reset(defaultValues);
  // }, [defaultValues, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);  // Send submitted data
    reset();         // Clear form state
    setOpen(false);  // Close dialog
  };

  const handleConfirm = () => {
    onSubmit(defaultValues); // Pass the selected item’s ID or data
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {mode === "form" && fields && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name} className="mb-2">
                  {field.label}
                </Label>
                {field.type === "date" ? (
                  <Controller
                    control={control}
                    name={field.name}
                    rules={{ required: field.required }}
                    render={({ field: controllerField }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !controllerField.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {controllerField.value
                              ? format(controllerField.value, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={controllerField.value}
                            onSelect={controllerField.onChange}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1950}
                            toYear={new Date().getFullYear()}
                            className="rounded-md border shadow dark:bg-popover dark:border-border"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.name, { required: field.required })}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        )}

        {mode === "confirm" && (
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white"
              onClick={handleConfirm}
            >
              Yes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
