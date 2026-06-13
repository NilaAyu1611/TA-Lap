// import api from "@/lib/api";

// export const loginUser = async (
//   email: string,
//   password: string
// ) => {
//   const response = await api.post(
//     "/auth/login",
//     {
//       email,
//       password,
//     }
//   );

//   return response.data;
// };




import api from "@/lib/api";

export const login = async (
  email: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};