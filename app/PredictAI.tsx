import React from 'react'

export default function PredictAI() {
  return (
    <div>
      <div className="font-white block w-300 my-50 mx-20">
        <h1 className="text-4xl font-bold">Predict</h1>
        <div className="">
              <label style={{
                  marginTop: "10px",
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: 'black',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
          Upload Image
          <input type="file" style={{ display: 'none' }} />
        </label>

        
        </div>
      </div>
    </div>
  )
}
