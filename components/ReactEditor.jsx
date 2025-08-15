"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import php from "highlight.js/lib/languages/php";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import typescript from "highlight.js/lib/languages/typescript";
import jsx from "highlight.js/lib/languages/xml"; // highlight.js n'a pas jsx natif, xml est le plus proche

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("php", php);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("jsx", xml); // pour React, coloration basique

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
    syntax: {
        highlight: text => hljs.highlightAuto(text).value
    },
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"]
    ],
};

const formats = [
    "header", "bold", "italic", "underline",
    "blockquote", "code-block", "list", "bullet", "link", "image",
    "align"
];


// Utilitaire pour transformer <pre>...</pre> en <pre><code>...</code></pre>
function wrapPreWithCode(html) {
    if (!html) return html;
    // Remplace chaque <pre>...</pre> qui ne contient pas déjà <code>
    return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (match, p1) => {
        // Si déjà <code>, ne rien faire
        if (p1.trim().startsWith('<code>')) return match;
        return `<pre><code>${p1}</code></pre>`;
    });
}

export default function ReactEditor({ value, onChange }) {
        // On applique le post-traitement à la sauvegarde
        const handleChange = (val) => {
            onChange(wrapPreWithCode(val));
        };
        return (
                <div>
                <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={handleChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Écris ici..."
                />
                </div>
        );
}
