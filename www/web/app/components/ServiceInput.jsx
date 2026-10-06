import { useEffect, useState } from "react";
import { Autocomplete, InputAdornment, TextField, Typography } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { api } from "../lib/api";

// Shared across every component that asks, so the list is fetched once per page load
let popularCache = null;
let popularRequest = null;

export function usePopularServices() {
  const [popular, setPopular] = useState(popularCache || []);
  useEffect(() => {
    if (popularCache) return;
    popularRequest ||= api("/services/popular").then((rows) => (popularCache = rows));
    let active = true;
    popularRequest
      .then((rows) => active && setPopular(rows))
      .catch(() => {
        popularRequest = null; // allow a retry on the next mount
      });
    return () => {
      active = false;
    };
  }, []);
  return popular;
}

// Free text with suggestions drawn from what providers actually offer,
// so people aren't left guessing what to type.
export function ServiceInput({
  value,
  onChange,
  onSubmit,
  label = "What do you need?",
  placeholder = "Plumber, electrician, hair stylist…",
  autoFocus,
  size,
  inputRef,
  error,
  helperText,
  ...props
}) {
  const popular = usePopularServices();
  return (
    <Autocomplete
      freeSolo
      options={popular}
      getOptionLabel={(o) => (typeof o === "string" ? o : o.label)}
      inputValue={value}
      onInputChange={(_, v) => onChange(v)}
      onChange={(_, v) => {
        if (v) onSubmit?.(typeof v === "string" ? v : v.label);
      }}
      renderOption={({ key, ...optionProps }, option) => (
        <li key={key} {...optionProps} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>{option.label}</span>
          <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
            {option.count} {option.count === 1 ? "pro" : "pros"}
          </Typography>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label={label}
          placeholder={placeholder}
          autoFocus={autoFocus}
          size={size}
          error={error}
          helperText={helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      {...props}
    />
  );
}
