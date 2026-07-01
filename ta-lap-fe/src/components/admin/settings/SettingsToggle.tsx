"use client";

type Props = {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function SettingsToggle({ enabled, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-7 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        enabled ? "bg-cyan-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          enabled ? "right-1" : "left-1"
        }`}
      />
    </button>
  );
}
