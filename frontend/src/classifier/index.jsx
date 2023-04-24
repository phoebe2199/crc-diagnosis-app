import React, { useState } from "react";

const Classifier = () => {
    const [result, setResult] = useState("");
    const [model, setModel] = useState("VGG16 Transfer Learning")
    const [loading, setLoading] = useState(false);

    const handleModel = (event) => {
        setModel(event.target.value);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image", file); 
        formData.append("model", model);

        setResult("")
        setLoading(true)
        const response = await fetch('http://localhost:5000/classify', {
            method: "POST",
            body: formData,
            // body: {"image": file, "model": model},
        });

        setLoading(false);
        if (response.ok) {
            const text = await response.text();
            setResult(text);
        } else {
            const error = await response.text();
            console.log(error);
            setResult(error);
        }
    };

    // the following HTML is rendered when Classifier() is called
    return (
        <>
        <div></div>
            <header>
                <h1>Classify Image:</h1>
            </header>
            <label>
                Select model:
                <select value={model} onChange={handleModel}>
                    <option value="VGG16 Transfer Learning">VGG16 Transfer Learning</option>
                    <option value="IV3 Transfer Learning">IV3 Transfer Learning</option>
                    <option value="RN50 Transfer Learning">RN50 Transfer Learning</option>
                    <option value="RN50">RN50</option>
                </select>
            </label>
            <main>
                <input type="file" onChange={handleImageUpload} accept="image/*" id="upload-img"/>
                {result && <p>{result}</p>}
                {loading && <p><img src={require("./img/progress_transparent.gif")} alt="Loading" width={70}/></p>}
                <div id="display-image">

                </div>
            </main> 
        </>
    );
};

export default Classifier;