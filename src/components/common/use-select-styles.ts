import { useMemo } from "react";
import type { StylesConfig } from "react-select";

import type { SelectWithSearchOption } from "./select-with-search";

export function useSelectStyles(isInvalid: boolean): StylesConfig<SelectWithSearchOption, boolean> {
  return useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: 36,
        borderRadius: "calc(var(--radius) - 2px)",
        borderColor: isInvalid ? "var(--destructive)" : "var(--input)",
        backgroundColor: "var(--background)",
        boxShadow: state.isFocused
          ? isInvalid
            ? "0 0 0 3px color-mix(in oklch, var(--destructive) 25%, transparent)"
            : "0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent)"
          : undefined,
        "&:hover": {
          borderColor: isInvalid ? "var(--destructive)" : "var(--input)",
        },
      }),
      valueContainer: (base) => ({
        ...base,
        paddingLeft: 8,
        paddingRight: 8,
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--foreground)",
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: "var(--muted)",
        borderRadius: "calc(var(--radius) - 4px)",
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: "var(--foreground)",
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        "&:hover": {
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
        },
      }),
      input: (base) => ({
        ...base,
        color: "var(--foreground)",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 50,
        borderRadius: "calc(var(--radius) - 2px)",
        backgroundColor: "var(--popover)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }),
      menuList: (base) => ({
        ...base,
        padding: 4,
      }),
      option: (base, state) => ({
        ...base,
        borderRadius: "calc(var(--radius) - 4px)",
        cursor: "pointer",
        color: "var(--foreground)",
        backgroundColor: state.isSelected
          ? "var(--accent)"
          : state.isFocused
            ? "color-mix(in oklch, var(--accent) 60%, transparent)"
            : "transparent",
        "&:active": {
          backgroundColor: "var(--accent)",
        },
      }),
      indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "var(--border)",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        "&:hover": {
          color: "var(--foreground)",
        },
      }),
      clearIndicator: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        "&:hover": {
          color: "var(--foreground)",
        },
      }),
      loadingIndicator: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
      }),
    }),
    [isInvalid],
  );
}
