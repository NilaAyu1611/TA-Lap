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
  OwnerDashboardBulanan,
  OwnerDashboardMetode,
  OwnerDashboardStatusCount,
  OwnerDashboardTopLapangan,
} from "@/types/ownerDashboard";

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
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-gray-900">
      <p className="mb-1 font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </p>
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

type RevenueProps = {
  data: OwnerDashboardBulanan[];
};

export function OwnerRevenueChart({ data }: RevenueProps) {
  if (data.length === 0) {
    return (
      <EmptyChart message="Belum ada data pendapatan — konfirmasi pembayaran sukses untuk melihat grafik." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pendapatanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          className="text-gray-500"
          tickLine={false}
          axisLine={false}
        />
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
          className="text-gray-500"
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="pendapatan"
          name="Pendapatan Bersih"
          stroke="#10b981"
          fill="url(#pendapatanGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="booking"
          name="Booking"
          stroke="#06b6d4"
          fill="transparent"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type StatusProps = {
  data: OwnerDashboardStatusCount[];
};

export function OwnerBookingStatusChart({ data }: StatusProps) {
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
            <Cell
              key={entry.key}
              fill={STATUS_COLORS[entry.key] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${Number(value ?? 0)} pesanan`, String(name)]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

type MetodeProps = {
  data: OwnerDashboardMetode[];
};

export function OwnerPaymentMethodChart({ data }: MetodeProps) {
  const chartData = data.map((item, i) => ({
    name: formatMetodePembayaran(item.metode),
    pendapatan: item.pendapatan,
    count: item.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada transaksi sukses." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : `${(v / 1_000).toFixed(0)}rb`
          }
        />
        <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value) => [formatRupiah(Number(value ?? 0)), "Pendapatan"]}
        />
        <Bar dataKey="pendapatan" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

type TopProps = {
  data: OwnerDashboardTopLapangan[];
};

export function OwnerTopLapanganChart({ data }: TopProps) {
  const chartData = data.map((item) => ({
    name:
      item.nama.length > 14 ? `${item.nama.slice(0, 14)}…` : item.nama,
    fullName: item.nama,
    pendapatan: item.pendapatan,
    booking: item.booking,
  }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada performa lapangan." />;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 48)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : `${(v / 1_000).toFixed(0)}rb`
          }
        />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value, _name, props) => [
            `${formatRupiah(Number(value ?? 0))} · ${props.payload?.booking ?? 0} booking`,
            props.payload?.fullName ?? "Pendapatan",
          ]}
        />
        <Bar dataKey="pendapatan" fill="#8b5cf6" radius={[0, 6, 6, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 text-center text-sm text-gray-500 dark:border-white/10">
      {message}
    </div>
  );
}
