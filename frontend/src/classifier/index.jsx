import React, { useState } from "react";

const Classifier = () => {
    const [result, setResult] = useState("");
    const [image, setImage] = useState("");
    const [model, setModel] = useState("InceptionV3 Transfer Learning");
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
        setImage("")
        setLoading(true)
        const response = await fetch('http://localhost:5000/classify', {
            method: "POST",
            body: formData,
        });

        const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                setLoading(false);
                setImage(<img src={imageUrl} alt="uploaded"/>);
            };
        reader.readAsDataURL(file);

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
        <div class="align-center">
            <label>
                <h5>Select model...</h5>
                <select value={model} onChange={handleModel}>
                    <option value="VGG16 From Scratch">VGG16 From Scratch</option>
                    <option value="VGG16 Transfer Learning">VGG16 Transfer Learning</option>
                    <option value="ResNet50 From Scratch">ResNet50 From Scratch</option>
                    <option value="ResNet50 Transfer Learning">ResNet50 Transfer Learning</option>
                    <option value="InceptionV3 From Scratch">InceptionV3 From Scratch</option>
                    <option value="InceptionV3 Transfer Learning">InceptionV3 Transfer Learning</option>
                </select>
            </label>
            <main>
                <label for="upload-img" class="custom-file-upload">
                    <h5><i class="fa fa-upload fa-fw fa-fw" aria-hidden="true"></i>&nbsp;Upload File...</h5>
                    <input type="file" onChange={handleImageUpload} accept="image/*" id="upload-img" for="upload-img"/>
                    {result && <p class="result">{result}</p>}
                    {image && <p>{image}</p>}
                    {loading && <p><img src={require("./img/progress_transparent.gif")} alt="Loading" width={70}/></p>}
                    <div id="display-image">

                    </div>
                </label>
            </main>
            </div>
        </>
    );
};

export default Classifier;