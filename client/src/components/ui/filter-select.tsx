"use client"

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <select
      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
