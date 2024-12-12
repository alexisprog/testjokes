import { CategoriesView } from "@/src/modules/home/CategoriesView";
// import { useAuthStore } from "@/src/store/useAuthStore";
const HomeScreen = () => {
  // const { signOut } = useAuthStore();
  // const handleLogout = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     console.error("Error al cerrar sesión:", error);
  //   }
  // };

  return <CategoriesView />;
};

export default HomeScreen;
