import { useRouter } from "next/router";
import HeaderComponent from "../ui-kit/organisms/Header";

export default function Header() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/connexionPage");
  };
  return (
    <header>
     
    </header>
  );
}
