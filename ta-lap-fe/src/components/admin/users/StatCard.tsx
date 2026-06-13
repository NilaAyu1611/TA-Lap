import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;

  iconColor: string;
  bgColor: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-white/5
        p-6
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-3
              text-4xl
              font-black
            "
          >
            {value}
          </h3>
        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${bgColor}
          `}
        >
          <Icon className={iconColor} />
        </div>
      </div>
    </div>
  );
}