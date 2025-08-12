import styles from "../styles/Posts.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "../ui-kit/template/MainLayout";
import Button from "../ui-kit/atoms/Button";
import Input from "../ui-kit/atoms/Input";
import TextArea from "../ui-kit/atoms/TextArea";
import Select from "react-select";
import { useSelector } from "react-redux";
import Spinner from "../ui-kit/atoms/Spinner";

function Posts(props) {
  let user = useSelector((state) => state.user.value);
  const { type } = props;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("question");
  const [selectLanguages, setSelectLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);

  const id = props.id || null;

  useEffect(() => {
    if (!user.token) {
      router.push("/connexionPage");
    }

    // recuperation des langages via le backend
    console.log("fetch language");
    fetch("http://localhost:3000/languages/")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          //console.log(data);
          setLanguages(data.data);
        }
      });
    console.log("end fetch");
    if (type === "edit" && id) {
      const { id } = props;
      console.log("id", id);
      // Logique pour charger les données du post à éditer
      fetch(`http://localhost:3000/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setTitle(data.post.title);
            setContent(data.post.content);
            setPostType(data.post.type);
            const selectedLanguages = data.post.languages.map((lang) => ({
              key: lang._id,
              value: lang.name,
              label: lang.name,
            }));
            setSelectLanguages(selectedLanguages);
          }
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const btn = e.nativeEvent.submitter;
    const status = btn.value === "publish" ? "published" : "draft";
    // Récupération des données du formulaire
    const selectedLanguageValues =
      selectLanguages && selectLanguages.length > 0
        ? selectLanguages.map((lang) => lang.key)
        : [];

    const postData = {
      userId: user.id,
      type: postType,
      title: title,
      content: content,
      languages: selectedLanguageValues,
      status: status,
    };

    fetch("http://localhost:3000/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.result) {
          console.log("Post created successfully:", data.post);
          if (status === "draft" && type !== "edit") {
            router.push(`/posts/edit/${data.post._id}`);
          } else if (status === "published") {
            router.push(`/posts/${data.post._id}`);
          } else {
            router.push("/dashboard");
          }
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const dataListLanguages = languages.map((lang) => ({
    key: lang._id,
    value: lang.name,
    label: lang.name,
  }));

  return (
    <MainLayout className={styles.posts}>
      <div className={styles.content}>
        <div className={styles.btnBack}>
          <Button variant="primary" onClick={() => router.back()}>
            Retour
          </Button>
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>
            {type === "edit" ? `Sujet: ${title}` : "Nouveau Sujet"}
          </h1>
          {type !== "edit" && (
            <p>
              Vous souhaitez contribuer au forum ? Vous avez la possibilité de
              poser une question technique ou de donner une astuce. Selectionnez
              votre choix ci-dessous.
            </p>
          )}
          <div className={styles.form}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={styles.radioGroupContainer}>
                <div className={styles.radioGroup}>
                  <Input
                    type="radio"
                    id="question"
                    name="type"
                    value="question"
                    checked={postType === "question"}
                    onChange={(e) => setPostType(e.target.value)}
                  />
                  <label htmlFor="question">Question</label>
                </div>
                <div className={styles.radioGroup}>
                  <Input
                    type="radio"
                    id="tip"
                    name="type"
                    value="tip"
                    checked={postType === "tip"}
                    onChange={(e) => setPostType(e.target.value)}
                  />
                  <label htmlFor="tip">Astuce</label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <Select
                  options={dataListLanguages}
                  isMulti
                  placeholder="Sélectionnez une langue"
                  onChange={(selectedOptions) =>
                    setSelectLanguages(selectedOptions || [])
                  }
                  value={selectLanguages}
                />
              </div>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Titre question ou Astuce"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={type === "edit" ? "disabled" : ""}
                  disabled={type === "edit"}
                />
              </div>
              <div className={styles.formGroup}>
                <TextArea
                  placeholder="Écrivez votre message ici..."
                  id="content"
                  name="content"
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  type="submit"
                  variant="secondary"
                  value="draft"
                  name="action"
                >
                  {type === "edit" ? "Enregistrer" : "Brouillon"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  value="publish"
                  name="action"
                >
                  Publier
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Posts;
