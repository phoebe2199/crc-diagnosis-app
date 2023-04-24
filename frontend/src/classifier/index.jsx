import React, { useState } from "react";

const Classifier = () => {
    const [result, setResult] = useState("");
    const [image, setImage] = useState("");
    const [model, setModel] = useState("VGG16 Transfer Learning");
    const [loading, setLoading] = useState(false);
    // const image_input = document.querySelector("upload-img");

    // var uploaded_img = "";

    // console.log(file.name)
    // const reader = new FileReader();
    // reader.addEventListener("load", () => {
    //     uploaded_image = reader.result;
    //     document.querySelector("#display-image").style.background
    // })


    // image_input.addEventListener("change", function(){
    //     console.log(image_input.value)
    // })

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
                {result && <h5>{result}</h5>}
                {image && <p>{image}</p>}
                {loading && <p><img src={require("./img/progress_transparent.gif")} alt="Loading" width={70}/></p>}
                <div id="display-image">

                </div>
            </main>
            </div>
        </>
    );
};

export default Classifier;