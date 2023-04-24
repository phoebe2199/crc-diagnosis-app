// import { useRef } from 'react'
// import { Toast } from 'primereact/toast';
// import { FileUpload } from 'primereact/fileupload';
import Classifier from './classifier';
import './App.css';

export default function App() {
    // const toast = useRef(null);

    // const onUpload = () => {
    //     toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    // };
        
    // return (
    //   <div className="App container">
    //     <div className="row">
    //       <div className="text-center">
    //         <h1>Colorectal Cancer Diagnosis Tool</h1>
    //         <div className="card flex justify-content-center">
    //             <Toast ref={toast}></Toast>
    //             <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} auto chooseLabel="Browse" />
    //         </div>
    //       </div>
    //     </div>
        
    //     <Classifier 
    //     />
  
    //   </div>
    // )
      // the following HTML is always displayed 
    return (
        <Classifier/>
    );
  }