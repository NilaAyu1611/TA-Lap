import prisma from "../../config/prisma.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value
    )
  );


// GET ALL OWNERS
export const getAllOwners =
  async (req, res) => {
    try {
      const owners =
        await prisma.user.findMany({
          where: {
            role: "owner",
          },
        });

      res.json({
        data: serialize(owners),
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };


  
// DELETE OWNER
export const deleteOwner =
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: {
          id: BigInt(id),
        },
      });

      res.json({
        message:
          "Owner berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };