import { useId, useMemo } from "react";
import AsyncSelect from "react-select/async";
import type { MultiValue, SingleValue, StylesConfig } from "react-select";

import { Field, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { cn } from "@/lib/utils";

/** Option shape for react-select; use as `mapFunc` return type. */
export type SelectWithSearchOption = {
  label: string;
  value: string;
};

type BaseProps<T> = {
  errorText?: string;
  isMulti?: boolean;
  label?: string;
  mapFunc: (el: T) => SelectWithSearchOption;
  minForSearch?: number;
  noOptsEmpty?: string;
  noOptsResult?: string;
  placeholder?: string;
  /** Return raw rows; map with `mapFunc`. Axios: `(q) => api.get(...).then((r) => r.data)`. */
  searchRequest: (query: string) => Promise<T[]>;
  testMode?: boolean;
  width?: number;
  className?: string;
};

type SingleSelectProps<T> = BaseProps<T> & {
  isMulti?: false;
  value?: SingleValue<SelectWithSearchOption>;
  onChange: (value: SingleValue<SelectWithSearchOption>) => void;
};

type MultiSelectProps<T> = BaseProps<T> & {
  isMulti: true;
  value?: MultiValue<SelectWithSearchOption>;
  onChange: (value: MultiValue<SelectWithSearchOption>) => void;
};

export type SelectWithSearchProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;

function useSelectStyles(isInvalid: boolean): StylesConfig<SelectWithSearchOption, boolean> {
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

export function SelectWithSearch<T>({
  minForSearch = 1,
  errorText,
  isMulti = false,
  label,
  noOptsEmpty = `Введите ${minForSearch} или более символов для поиска`,
  noOptsResult = "Не найдены варианты по данному запросу",
  onChange,
  placeholder = "",
  searchRequest,
  testMode,
  value,
  width,
  mapFunc,
  className,
}: SelectWithSearchProps<T>) {
  const inputId = useId();
  const styles = useSelectStyles(Boolean(errorText));

  const loadOptions = (inputValue: string) => {
    if (inputValue.length < minForSearch) {
      return Promise.resolve([] as SelectWithSearchOption[]);
    }

    return searchRequest(inputValue).then((rows) => {
      if (testMode) console.log("search response", rows);
      const options = Array.isArray(rows) ? rows.map(mapFunc) : [];
      if (testMode) console.log("search options", options);
      return options;
    });
  };

  return (
    <Field className={cn(className)} style={width != null ? { width } : undefined}>
      {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
      <AsyncSelect<SelectWithSearchOption, boolean>
        inputId={label ? inputId : undefined}
        instanceId={inputId}
        isMulti={isMulti}
        placeholder={placeholder}
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
        noOptionsMessage={({ inputValue }) => (inputValue.length < minForSearch ? noOptsEmpty : noOptsResult)}
        isClearable
        value={value}
        onChange={onChange as (v: MultiValue<SelectWithSearchOption> | SingleValue<SelectWithSearchOption>) => void}
        styles={styles}
        classNamePrefix="select-with-search"
      />
      {errorText ? <FieldError>{errorText}</FieldError> : null}
    </Field>
  );
}
