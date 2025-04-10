'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils'; // shadcn utility
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandItem,
} from '@/components/ui/command';

import { LOCATIONS, LocationItem } from './location-data';

interface LocationComboboxProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function LocationCombobox({
  label,
  placeholder,
  value,
  onChange,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = LOCATIONS.find((l) => l.label === value);

  function handleSelect(item: LocationItem) {
    onChange(item.label);
    setOpen(false);
  }

  return (
    <div className="flex flex-col w-full min-w-[140px]">
      <label className="mb-1 text-sm font-medium leading-none">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-full"
          >
            {selected ? selected.label : placeholder ?? 'Select…'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search…" />
            <CommandEmpty>No match.</CommandEmpty>
            <CommandList>
              {LOCATIONS.map((loc) => (
                <CommandItem
                  key={loc.label}
                  value={loc.label}
                  onSelect={() => handleSelect(loc)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === loc.label ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {loc.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
