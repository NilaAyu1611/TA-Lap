"use client";



import { useEffect, useMemo, useState } from "react";

import { LayoutGrid, Map } from "lucide-react";



import UserNavbar from "@/components/UserNavbar";

import LapanganMapsSearch, {

  LapanganSearchApply,

  LocationFilter,

} from "@/components/user/lapangan/LapanganMapsSearch";

import LapanganMapBrowse from "@/components/user/lapangan/LapanganMapBrowse";

import UserLapanganCard from "@/components/user/lapangan/UserLapanganCard";

import { distanceKm } from "@/lib/geo";

import { getLapangan } from "@/services/lapangan.service";

import { Lapangan } from "@/types/lapangan";



type ViewMode = "grid" | "map";



export default function LapanganPage() {

  const [searchQuery, setSearchQuery] = useState("");

  const [keywordFilter, setKeywordFilter] = useState("");

  const [jenisFilter, setJenisFilter] = useState<string>("all");

  const [locationFilter, setLocationFilter] = useState<LocationFilter>({

    center: null,

    radiusKm: 25,

  });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [mapSelectedId, setMapSelectedId] = useState<string | null>(null);

  const [lapangans, setLapangans] = useState<Lapangan[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchData = async () => {

      try {

        const result = await getLapangan();

        setLapangans(result.data || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);



  const jenisOptions = useMemo(() => {

    const set = new Set<string>();

    lapangans.forEach((l) => {

      if (l.jenis) set.add(l.jenis);

    });

    return Array.from(set).sort();

  }, [lapangans]);



  const handleSearchApply = (state: LapanganSearchApply) => {

    setSearchQuery(state.query);

    setKeywordFilter(state.keywords);

    setLocationFilter({

      center: state.center,

      radiusKm: state.radiusKm,

    });

    if (state.jenis && state.jenis !== "all") {

      setJenisFilter(state.jenis);

    } else if (!state.query.trim()) {

      setJenisFilter("all");

    }

  };



  const filtered = useMemo(() => {

    const q = keywordFilter.toLowerCase().trim();



    return lapangans

      .map((item) => {

        let distanceKmVal: number | null = null;

        if (

          locationFilter.center &&

          item.latitude != null &&

          item.longitude != null

        ) {

          distanceKmVal = distanceKm(

            locationFilter.center.lat,

            locationFilter.center.lng,

            item.latitude,

            item.longitude

          );

        }

        return { ...item, distanceKm: distanceKmVal };

      })

      .filter((item) => {

        const matchSearch =

          !q ||

          item.nama.toLowerCase().includes(q) ||

          (item.jenis || "").toLowerCase().includes(q) ||

          (item.kota || "").toLowerCase().includes(q) ||

          (item.alamat || "").toLowerCase().includes(q);

        const matchJenis =

          jenisFilter === "all" || item.jenis === jenisFilter;

        const matchRadius =

          !locationFilter.center ||

          (item.distanceKm != null &&

            item.distanceKm <= locationFilter.radiusKm);

        return matchSearch && matchJenis && matchRadius;

      })

      .sort((a, b) => {

        if (locationFilter.center) {

          if (a.distanceKm == null && b.distanceKm == null) return 0;

          if (a.distanceKm == null) return 1;

          if (b.distanceKm == null) return -1;

          return a.distanceKm - b.distanceKm;

        }

        return a.nama.localeCompare(b.nama);

      });

  }, [lapangans, keywordFilter, jenisFilter, locationFilter]);



  useEffect(() => {

    if (filtered.length > 0 && !mapSelectedId) {

      setMapSelectedId(filtered[0].id);

    }

  }, [filtered, mapSelectedId]);



  return (

    <main className="min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#0b1120] dark:text-white">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      </div>



      <UserNavbar active="lapangan" />



      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">

        <div className="max-w-3xl">

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">

            Cari Lapangan

          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Cari venue berdasarkan jenis olahraga, nama, atau kota. Lokasi
            perangkat dipakai untuk menghitung jarak dan radius tampilan.
          </p>

        </div>



        <div className="mt-6 space-y-4">

          <LapanganMapsSearch

            lapangans={lapangans}

            locationFilter={locationFilter}

            jenisFilter={jenisFilter}

            searchQuery={searchQuery}

            keywordFilter={keywordFilter}

            onApply={handleSearchApply}

          />



          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex-1" />



            <div className="flex items-center gap-2">

              <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">

                <button

                  type="button"

                  onClick={() => setViewMode("grid")}

                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${

                    viewMode === "grid"

                      ? "bg-cyan-600 text-white"

                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400"

                  }`}

                >

                  <LayoutGrid size={16} />

                  Grid

                </button>

                <button

                  type="button"

                  onClick={() => setViewMode("map")}

                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${

                    viewMode === "map"

                      ? "bg-cyan-600 text-white"

                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400"

                  }`}

                >

                  <Map size={16} />

                  Peta

                </button>

              </div>

            </div>

          </div>



          {jenisOptions.length > 0 && (

            <div className="flex flex-wrap gap-2">

              <button

                type="button"

                onClick={() => setJenisFilter("all")}

                className={`rounded-full px-4 py-2 text-sm font-medium transition ${

                  jenisFilter === "all"

                    ? "bg-cyan-600 text-white"

                    : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300"

                }`}

              >

                Semua

              </button>

              {jenisOptions.map((jenis) => (

                <button

                  key={jenis}

                  type="button"

                  onClick={() => setJenisFilter(jenis)}

                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${

                    jenisFilter === jenis

                      ? "bg-cyan-600 text-white"

                      : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300"

                  }`}

                >

                  {jenis}

                </button>

              ))}

            </div>

          )}

        </div>



        <p className="mt-6 text-sm text-gray-500">

          {loading

            ? "Memuat..."

            : `${filtered.length} lapangan${

                locationFilter.center

                  ? ` · radius ${locationFilter.radiusKm} km dari ${locationFilter.center.label || "lokasi Anda"}`

                  : ""

              }`}

        </p>



        <div className="mt-6">

          {loading && (

            <p className="text-center text-gray-500">Memuat lapangan...</p>

          )}

          {!loading && filtered.length === 0 && (

            <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500 dark:border-white/10">

              {locationFilter.center

                ? "Belum ada venue dalam radius ini. Perbesar radius atau ubah kata kunci."

                : "Tidak ada venue yang cocok dengan pencarian."}

            </p>

          )}

          {!loading && filtered.length > 0 && viewMode === "grid" && (

            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">

              {filtered.map((item) => (

                <UserLapanganCard

                  key={item.id}

                  lapangan={item}

                  distanceKm={item.distanceKm}

                />

              ))}

            </div>

          )}

          {!loading && filtered.length > 0 && viewMode === "map" && (

            <LapanganMapBrowse

              lapangans={filtered}

              selectedId={mapSelectedId}

              onSelect={setMapSelectedId}

            />

          )}

        </div>

      </section>

    </main>

  );

}


