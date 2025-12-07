'use client';

import React, { useEffect, useState } from 'react';

interface MRIItem {
  file: string;
  label: string;
}

const classes = ["Mild Demented", "Moderate Demented", "NonDemented", "Very Mild Demented"];

const FetchImage: React.FC = () => {
  const [data, setData] = useState<MRIItem[]>([]);
  const [current, setCurrent] = useState<MRIItem | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    fetch('/mri/label.json')
      .then(res => res.json())
      .then((json: MRIItem[]) => {
        setData(json);
        pickRandom(json);
      })
      .catch(err => console.error('Failed to load label.json:', err));
  }, []);

  const pickRandom = (arr: MRIItem[] = data) => {
    if (arr.length === 0) return;
    const idx = Math.floor(Math.random() * arr.length);
    setCurrent(arr[idx]);
    setFeedback(""); // reset feedback
  };

  const checkAnswer = (choice: string) => {
    if (!current) return;
    if (choice === current.label) {
      setFeedback("Correct!");
      const audio = new Audio("/sound/check.mp3")
      audio.play();
    } else {
      setFeedback(`Correct answer: ${current.label}`);
      const wrong = new Audio("/sound/buzzer.mp3")
      wrong.play();
    }
  };

return (
  <div className="text-left">

    {current && (
      <div className="flex gap-6 items-start mb-6">

        <div className="flex flex-col">
          <img
            src={`/mri/${current.file}`}
            alt={current.label}
            className="w-70 h-70 rounded-xl shadow-lg mb-3"
          />

          <button
              onClick={() => pickRandom()}
              className="bg-blue-500 text-white px-4 py-2 rounded w-65"
            >
              Show Random MRI
            </button>
        </div>

        <div className="block mt-10">
          <h2 className="text-3xl font-semibold">Which case of Alzheimer is the brain based on the image?</h2>
          <div className="mt-7 grid grid-cols-2 gap-2 w-full">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => checkAnswer(cls)}
                className="bg-white text-black rounded hover:bg-blue-200 w-full h-15"
              >
                {cls}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="p-10 mt-10 w-[900px] h-auto border border-gray-700 shadow-lg gap-10 bg-gray-900">
              <p className="font-semibold text-left px-5">{feedback}</p>

            </div>
          )}

        </div>
      </div>
    )}
  </div>
);

};

export default FetchImage;
