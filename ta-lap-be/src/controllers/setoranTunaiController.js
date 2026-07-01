import {
  aggregateMonthCashKomisi,
  executeMonthlySetoran,
  getOwnerSetoranOverview,
  getSetoranOverview,
} from "../services/cashKomisiSetoranService.js";
import {
  approveSetoranPengajuan,
  attachPengajuanToOwnerMonths,
  getPlatformSetoranTujuan,
  listSetoranPengajuan,
  rejectSetoranPengajuan,
  submitOwnerSetoran,
} from "../services/setoranKomisiOwnerService.js";
import { getKomisiPersen } from "../utils/komisi.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

function parseYearMonth(tahun, bulan) {
  const y = Number(tahun);
  const m = Number(bulan);
  if (!Number.isInteger(y) || y < 2020 || y > 2100) {
    throw new Error("Tahun tidak valid");
  }
  if (!Number.isInteger(m) || m < 1 || m > 12) {
    throw new Error("Bulan tidak valid");
  }
  return { y, m };
}

/** Admin: ringkasan setoran komisi tunai per bulan. */
export const getSetoranTunaiOverview = async (req, res) => {
  try {
    const months = Math.min(Math.max(Number(req.query.months) || 12, 1), 24);
    const komisiPersen = await getKomisiPersen();
    const data = await getSetoranOverview(months);

    const totalMenunggu = data.reduce(
      (sum, row) => sum + (row.komisi_belum_setor || 0),
      0
    );

    res.json(
      serialize({
        komisi_persen: komisiPersen,
        total_komisi_menunggu: totalMenunggu,
        data,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Admin/owner: detail setoran satu bulan. */
export const getSetoranTunaiDetail = async (req, res) => {
  try {
    const { y, m } = parseYearMonth(req.params.tahun, req.params.bulan);
    const user = req.user;
    const ownerId = user.role === "owner" ? user.id : null;

    const agg = await aggregateMonthCashKomisi(y, m, ownerId);
    const komisiPersen = await getKomisiPersen();

    res.json(
      serialize({
        komisi_persen: komisiPersen,
        data: agg,
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** Owner: kewajiban setoran komisi tunai per bulan. */
export const getOwnerKewajibanSetoran = async (req, res) => {
  try {
    const months = Math.min(Math.max(Number(req.query.months) || 6, 1), 12);
    const komisiPersen = await getKomisiPersen();
    const raw = await getOwnerSetoranOverview(req.user.id, months);
    const data = await attachPengajuanToOwnerMonths(req.user.id, raw);
    const tujuan_bayar = await getPlatformSetoranTujuan();

    const totalBelumSetor = data.reduce(
      (sum, row) => sum + (row.komisi_belum_setor || 0),
      0
    );

    res.json(
      serialize({
        komisi_persen: komisiPersen,
        total_komisi_belum_setor: totalBelumSetor,
        tujuan_bayar,
        data,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Owner: kirim bukti setoran komisi bulanan. */
export const submitSetoranTunaiOwner = async (req, res) => {
  try {
    const { y, m } = parseYearMonth(req.params.tahun, req.params.bulan);
    const { metode, tanggal_bayar, catatan_owner, bukti_base64 } = req.body;

    const data = await submitOwnerSetoran(req.user.id, y, m, {
      metode,
      tanggal_bayar,
      catatan_owner,
      bukti_base64,
    });

    res.status(201).json(
      serialize({
        message: "Pengajuan setoran berhasil dikirim — menunggu verifikasi admin",
        data,
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** Admin: daftar pengajuan setoran dari owner. */
export const getSetoranPengajuan = async (req, res) => {
  try {
    const status = String(req.query.status || "all");
    const { rows, menunggu } = await listSetoranPengajuan({ status });

    res.json(serialize({ menunggu, data: rows }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Admin: setujui pengajuan setoran owner. */
export const approveSetoranPengajuanHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_admin } = req.body;
    const data = await approveSetoranPengajuan(
      req.user.id,
      id,
      catatan_admin
    );

    res.json(
      serialize({
        message: "Setoran owner disetujui — komisi ditandai lunas",
        data,
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** Admin: tolak pengajuan setoran owner. */
export const rejectSetoranPengajuanHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_admin } = req.body;
    const data = await rejectSetoranPengajuan(
      req.user.id,
      id,
      catatan_admin
    );

    res.json(
      serialize({
        message: "Pengajuan setoran ditolak — owner dapat kirim ulang",
        data,
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** Admin: setor akumulasi komisi tunai bulan ke pihak terkait. */
export const markSetoranTunaiDisetor = async (req, res) => {
  try {
    const { y, m } = parseYearMonth(req.params.tahun, req.params.bulan);
    const { catatan } = req.body;

    const result = await executeMonthlySetoran(y, m, req.user.id, catatan);

    res.json(
      serialize({
        message: `Setoran komisi tunai ${m}/${y} berhasil dicatat`,
        data: {
          setoran_id: String(result.setoran.id),
          jumlah_transaksi: result.jumlah_transaksi,
          total_komisi: result.total_komisi,
          tanggal_setor: result.setoran.tanggal_setor,
        },
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
