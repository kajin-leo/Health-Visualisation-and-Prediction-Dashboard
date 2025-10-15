import React, { useState } from "react";
import defaultAvatar from "../../assets/1.png"; 

const AvatarUploader = ({ currentAvatar, onFileSelect }) => {
  const [preview, setPreview] = useState(currentAvatar || null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setPreview(URL.createObjectURL(selected));
    onFileSelect(selected); 
  };

  return (
    <div className="flex flex-col items-center gap-4">
      
      <div className="relative w-32 h-32">
        <img
          src={preview || defaultAvatar}
          alt="Avatar Preview"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
        />
        <label className={
     "absolute bottom-0 right-0 bg-gradient-to-t from-violet-300 to-blue-300 text-white py-1 px-2 rounded-full cursor-pointer hover:bg-blue-600 transition text-xs font-bold font-[Nunito]"}>
          Select File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUploader;
