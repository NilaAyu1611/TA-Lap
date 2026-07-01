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
  UserDashboardBulanan,
  UserDashboardJenisCount,
  UserDashboardMetode,
  UserDashboardStatusCount,
  UserDashboardTopLapangan,
} from "@/types/userDashboard";

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

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 px-6 text-center text-sm text-gray-500 dark:border-white/10">
      {message}
    </div>
  );
}

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

export function UserSpendingChart({ data }: { data: UserDashboardBulanan[] }) {
  if (data.length === 0) {
    return (
      <EmptyChart message="Belum ada riwayat booking — mulai pesan lapangan favorit Anda." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="pengeluaran"
          name="Pengeluaran"
          stroke="#06b6d4"
          fill="url(#pengeluaranGrad)"
          strokeWidth={2}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="booking"
          name="Booking"
          stroke="#8b5cf6"
          fill="transparent"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function UserBookingStatusChart({
  data,
}: {
  data: UserDashboardStatusCount[];
}) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_LABELS[d.status] || d.status,
      value: d.count,
      key: d.status,
    }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada data status booking." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.key}
              fill={STATUS_COLORS[entry.key] || CHART_COLORS[0]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [Number(value ?? 0), String(name)]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function UserPaymentMethodChart({
  data,
}: {
  data: UserDashboardMetode[];
}) {
  const chartData = data.map((d) => ({
    name: formatMetodePembayaran(d.metode),
    total: d.total,
    count: d.count,
  }));

  if (chartData.length === 0) {
    return <EmptyChart message="Belum ada riwayat pembayaran sukses." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          width={90}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => formatRupiah(Number(value ?? 0))}
          contentStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="total" name="Total Bayar" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UserTopLapanganChart({
  data,
}: {
  data: UserDashboardTopLapangan[];
}) {
  if (data.length === 0) {
    return <EmptyChart message="Belum ada lapangan favorit — booking venue pertama Anda." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis
          dataKey="nama"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="booking" name="Booking" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UserJenisOlahragaChart({
  data,
}: {
  data: UserDashboardJenisCount[];
}) {
  if (data.length === 0) {
    return <EmptyChart message="Belum ada preferensi olahraga." />;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis dataKey="jenis" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="count" name="Booking" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
