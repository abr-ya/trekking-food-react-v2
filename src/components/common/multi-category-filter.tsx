import { useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";

type CategoryOption = {
  id: string;
  name: string;
};

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;
  options: CategoryOption[];
  isLoading?: boolean;
  placeholder?: string;
};

export function MultiCategoryFilter({
  value,
  onChange,
  options,
  isLoading = false,
  placeholder = "Filter by category…",
}: Props) {
  const anchor = useComboboxAnchor();
  const [open, setOpen] = useState(false);

  const nameById = Object.fromEntries(options.map((o) => [o.id, o.name]));

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(ids) => {
        onChange(ids);
        setOpen(false);
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxChips ref={anchor}>
        {value.map((id) => (
          <ComboboxChip key={id}>{nameById[id] ?? id}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder={value.length === 0 ? placeholder : ""} disabled={isLoading} />
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem key={option.id} value={option.id}>
              {option.name}
            </ComboboxItem>
          ))}
          {options.length === 0 && <ComboboxEmpty>No categories found.</ComboboxEmpty>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
