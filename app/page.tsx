import Image from "next/image";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="bg-black block">
      <Navbar />
      <div className="font-white py-30 px-20 w-300">
        <h1 className="my-3 text-5xl font-bold block">How bad is the case of alzheimer?</h1>
        <p className="text-lg">This website is made to help medical student learn the how bad is the case of alzheimer based on the photo of the brain MRI. It has
          two features, you can upload the image and the AI can predict which class of alzheimer it is [Mild Demented, Moderate Demented, NonDemented, or Very Mild Demented] or you
          can guess which MRI is which class.
        </p>
      </div>
      {/* <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          Enter your image:
            <label style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: 'black',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
        Upload Image
        <input type="file" style={{ display: 'none' }} />
      </label> */}

      
      {/* </div> */}
    </div>
    
  );
}
