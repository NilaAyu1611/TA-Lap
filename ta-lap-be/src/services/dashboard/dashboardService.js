export const adminDashboardService = async () => {

  const totalUsers = await prisma.user.count({
    where: {
      role: "user"
    }
  });

  return {
    totalUsers
  };
};