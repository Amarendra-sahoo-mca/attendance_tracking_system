import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

type SearchableSelectProps = {
  name: string;
  label: string;
  control: any;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?:boolean
};

export function SearchableSelect({
  name,
  label,
  control,
  options,
  placeholder = "Select...",
  required = false,
  disabled
}: SearchableSelectProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled} 
                className={cn("w-full  justify-start text-left", !field.value && "text-muted-foreground")}
              >
                {options.find((opt) => opt.value === field.value)?.label || placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 ">
              <Command>
                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                <CommandList>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => field.onChange(option.value)}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
