"use client";

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SearchableSelect } from "./ui/searchableselect";

export type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "date"
    | "select"
    | "searchable-select"
    | "checkbox"
    | "password"
    | "textarea";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
  className?: string;
  labelClass?: string;
};

type Props = {
  fields: Field[];
  onSubmit: SubmitHandler<any>;
  defaultValues?: Record<string, any>;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  defaultButtonDisabled?: boolean;
  defaultButtonClassName?: string;
  card_form?: boolean;
  onCancel?: () => void;
  schema?: z.ZodType<any, any>;
};

export function DynamicForm({
  fields,
  onSubmit,
  defaultValues = {},
  submitButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
  defaultButtonDisabled=false,
  card_form = false,
  schema,
  defaultButtonClassName,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });
  
  
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitWithReset: SubmitHandler<any> = (data) => {
    onSubmit(data);
    reset();
  };

  const onInvalid = (errors: any) => {
    console.log("Validation Errors", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitWithReset, onInvalid)}
      className="space-y-4"
    >
      <div className={`${card_form ? "" : "grid grid-cols-4"}`}>
        {fields.map((field) => (
          <div key={field.name} className="mx-2">
            {!["searchable-select", "checkbox"].includes(field.type) && (
              <Label
                htmlFor={field.name}
                className="my-1 block text-sm font-medium"
              >
                {field.label}
              </Label>
            )}

            {field.type === "textarea" ? (
              <>
                <textarea
                  id={field.name}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  {...register(field.name, { required: field.required })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : field.type === "password" ? (
              <>
                <div className="relative">
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    {...register(field.name, { required: field.required })}
                    className="pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-10 cursor-pointer bg-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : field.type === "checkbox" ? (
              <>
                <div className="flex items-center space-x-2 mt-8">
                  <Controller
                    name={field.name}
                    disabled={field.disabled}
                    control={control}
                    rules={{ required: field.required }}
                    render={({ field: controllerField }) => (
                      <input
                        type="checkbox"
                        id={field.name}
                        {...controllerField}
                        checked={controllerField.value || false}
                        className="w-4 h-4"
                      />
                    )}
                  />
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    {field.label}
                  </label>
                </div>
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : field.type === "date" ? (
              <>
                <Controller
                  control={control}
                  disabled={field.disabled}
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
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : field.type === "select" ? (
              <>
                <select
                  {...register(field.name, { required: field.required })}
                  disabled={field.disabled}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : field.type === "searchable-select" ? (
              <>
                <SearchableSelect
                  name={field.name}
                  disabled={field.disabled}
                  label={field.label}
                  control={control}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  required={field.required}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            ) : (
              <>
                <Input
                  id={field.name}
                  type={field.type}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  {...register(field.name, { required: field.required })}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="w-36 bg-gray-200 cursor-pointer dark:text-black"
            onClick={onCancel}
          >
            {cancelButtonLabel}
          </Button>
        )}
        <Button
          type="submit"
          className={`${defaultButtonClassName ?? "w-36"} capitalize cursor-pointer`}
          disabled = {defaultButtonDisabled}
        >
          {submitButtonLabel}
        </Button>
      </div>
    </form>
  );
}
