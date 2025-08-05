import { useState } from "react";
import MainLayout from "../components/template/MainLayout";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import SearchBar from "../components/molecules/SearchBar";
import PostsList from "../components/organisms/PostsList";
import UserProfileCard from "../components/molecules/UserProfileCard";
import UiKitSection from "../components/molecules/UiKitSection";
import TextArea from "../components/atoms/TextArea";
import Checkbox from "../components/atoms/Checkbox";

import {
  PythonIcon,
  CIcon,
  CppIcon,
  JavaIcon,
  CsharpIcon,
  JavascriptIcon,
  PhpIcon,
  SqlIcon,
  VisualBasicIcon,
  ScratchIcon,
} from "../components/atoms/icons";

export default function Home() {
  const [option1, setOption1] = useState(true);
  const [option2, setOption2] = useState(false);
  return (
    <MainLayout>
      <h1>UI Kit - PingMe.dev</h1>

      <UiKitSection title="Atoms">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Input placeholder="Texte..." />
        <TextArea placeholder="Votre message..." rows={5} />
      </UiKitSection>

      <UiKitSection title="Langage Icons">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <PythonIcon size={32} />
          <CIcon size={22} />
          <CppIcon size={26} />
          <JavaIcon size={32} />
          <CsharpIcon size={26} />
          <JavascriptIcon size={26} />
          <PhpIcon size={32} />
          <SqlIcon size={32} />
          <VisualBasicIcon size={32} />
          <ScratchIcon size={32} />
        </div>
      </UiKitSection>

      <UiKitSection title="Checkboxes">
        <Checkbox
          label="Option 1"
          checked={option1}
          onChange={() => setOption1(!option1)}
        />
        <Checkbox
          label="Option 2"
          checked={option2}
          onChange={() => setOption2(!option2)}
        />
      </UiKitSection>

      <UiKitSection title="Molecules">
        <SearchBar onSearch={() => alert("Recherche")} />
        <UserProfileCard name="Jane Doe" avatar="/avatar.png" />
      </UiKitSection>

      <UiKitSection title="Organisms">
        <PostsList
          posts={[
            {
              id: 1,
              language: "javascript",
              title: "Problème avec une fonction map",
              username: "JaneDoe",
              timeAgo: "il y a 3 minutes",
              content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Vestibulum vitae ligula in nunc feugiat gravida. 
          Praesent ullamcorper fermentum eros, sed pulvinar sem.`,
            },
            {
              id: 2,
              language: "react",
              title: "Problème avec useEffect",
              username: "JohnSmith",
              timeAgo: "il y a 10 minutes",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae ligula in nunc feugiat gravida. Praesent ullamcorper fermentum eros, sed pulvinar sem.",
            },
          ]}
        />
      </UiKitSection>
    </MainLayout>
  );
}
