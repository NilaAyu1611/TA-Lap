"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import {
  AdminDashboardBulanan,
  AdminDashboardMetode,
  AdminDashboardStatusCount,
} from "@/types/adminDashboard";

const CHART_COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  dibayar: "Dibayar",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  expired: "Expired",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  dibayar: "#06b6d4",
  selesai: "#10b981",
  dibatalkan: "#ef4444",
  expired: "#94a3b8",
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-gray-900">
      <p className="mb-1 font-semibold text-gray-700 dark:text-gray-200">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}:{" "}
          {entry.name.toLowerCase().includes("booking")
            ? entry.value
            : formatRupiah(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function AdminVolumeChart({ data }: { data: AdminDashboardBulanan[] }) {
  if (data.length === 0) {
    return <EmptyChart message="Belum ada transaksi sukses." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="komisiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-white/10" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}jt`
              : v >= 1_000
                ? `${(v / 1_000).toFixed(0)}rb`
                : String(v)
          }
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="volume"
          name="Volume Transaksi"
          stroke="#06b6d4"
          fill="url(#volumeGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="komisi"
          name="Komisi Platform"
          stroke="#8b5cf6"
          fill="url(#komisiGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AdminBookingStatusChart({
  data,
}: {
  data: AdminDashboardStatusCount[];
}) {
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: STATUS_LABELS[item.status] ?? item.status,
      value: item.count,
      key: item.status,
    }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada pesanan." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${Number(value ?? 0)} pesanan`, String(name)]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AdminPaymentMethodChart({ data }: { data: AdminDashboardMetode[] }) {
  const chartData = data.map((item, i) => ({
    name: formatMetodePembayaran(item.metode),
    volume: item.volume,
    count: item.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada transaksi sukses." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-white/10" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : `${(v / 1_000).toFixed(0)}rb`
          }
        />
        <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [formatRupiah(Number(value ?? 0)), "Volume"]} />
        <Bar dataKey="volume" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center text-sm text-gray-500 dark:border-white/10">
      {message}
    </div>
  );
}
